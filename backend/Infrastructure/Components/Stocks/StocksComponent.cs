using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using FuncSharp;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Stock.Application.Exceptions;
using Stock.Application.Infrastructure.Components.Stocks;
using Stock.Application.Infrastructure.Components.Stocks.Dtos;
using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Components.Business;
using Stock.Components.Configuration;
using Stock.Components.Static;
using Stock.Components.Stocks.Dtos;
using Stock.Domain.Entities;
using Stock.Domain.Extensions;
using Stock.Utilities.Exceptions;
using Stock.Utilities.Extensions;
using Stock.Utilities.Globalization;
using Stock.Utilities.Globalization.Keys;
using Stock.Utilities.Helpers.Functions;
using Range = Stock.Application.Infrastructure.Components.Stocks.Range;

namespace Stock.Components.Stocks
{
    public class StocksComponent : BusinessComponent<Domain.Entities.Stock>, IStocksComponent
    {
        private readonly Iex _iex;

        public StocksComponent(IStocksRepository stocks, IOptions<Iex> iex)
            :base(stocks)
        {
            _iex = iex.Value;
        }

        public async Task<IEnumerable<Domain.Entities.Stock>> GetManyAsync(IClientSessionHandle session, DateTime from = default, DateTime to = default, string companySymbol = default)
        {
            return await companySymbol.ToOption().Match(
                async c => await GetManyAsync(session, b => b.Where(s => s.CreatedAt >= from && s.CreatedAt <= to && s.CompanySymbol == companySymbol), p => p.Exclude(s => s.CompanySymbol)),
                async _ => await GetManyAsync(session, b => b.Where(s => s.CreatedAt >= from && s.CreatedAt <= to))
            );
        }

        public async Task<IEnumerable<SimpleLatestStockResponse>> GetLatestAsync(IEnumerable<string> companies)
        {
            return await BusinessActionAsync(async _ =>
            {
                var stocks = new ConcurrentBag<SimpleLatestStockResponse>();
                var tasks = companies.Select(c => Task.Run(async () =>
                {
                    var data = (await GetStocks(c, Range.Current)).LatestStockResponse.Get(__ => throw new InternalException(InternalErrorType.IncorrectBehavior, Localization.Get(Keys.InvalidCoproduct))).Data.Last(d => d.Open.SafeNotEquals(default));
                    stocks.Add(new SimpleLatestStockResponse
                    {
                        CompanySymbol = c,
                        Content = new SimpleLatestStockResponse.Data
                        {
                            Open = data?.Open,
                            High = data?.High,
                            Low = data?.Low,
                            Close = data?.Close,
                            Volume = data?.Volume
                        }
                    });
                })).ToList();
                await Task.WhenAll(tasks);

                return stocks;
            });
        }

        public async Task AddNewAsync(IClientSessionHandle session, Range range)
        {
            var stocks = (await FetchNew(range)).ToList();
            var actionResult = await Actions.Throws<IEnumerable<Domain.Entities.Stock>, BusinessException>(_ => GetManyAsync(session, to: DateTime.MaxValue));
            await actionResult.Throws.Match(
                async t => await AddManyAsync(session, _ => stocks), 
                async f =>
                {
                    var newStocks = stocks.Where(s => actionResult.Value.FirstOrDefault(os => os.Is(s)).SafeEquals(default)).ToList();
                    if (newStocks.Any())
                    {
                        await AddManyAsync(session, _ => newStocks);
                    }
                }
            );
        }

        private async Task<IEnumerable<Domain.Entities.Stock>> FetchNew(Range range)
        {
            var companies = Utilities.Extensions.CollectionExtensions.GetEnumDescriptionValues<CompanySymbol>();
            var collection = new ConcurrentBag<List<Domain.Entities.Stock>>();
            var tasks = new List<Task>();
            foreach (var company in companies)
            {
                var t = Task.Run(async () =>
                {
                    var result = await GetStocks(company, range);
                    var innerCollection = new List<Domain.Entities.Stock>();
                    result.Match(
                        stocks =>
                        {
                            foreach (var stock in stocks.Select(s => Domain.Entities.Stock.TryCreate(company, s.Date, s.Open, s.High, s.Low, s.Close, s.Volume)))
                            {
                                stock.Success.Match(s => innerCollection.Add(s));
                            }
                        },
                        stock =>
                        {
                            var s = Domain.Entities.Stock.TryCreate(company, stock.Date, stock.Open.Value, stock.High.Value, stock.Low.Value, stock.Close.Value, stock.Volume);
                            s.Success.Match(st => innerCollection.Add(st));
                        }
                    );
                    if (innerCollection.Any())
                    {
                        collection.Add(innerCollection);
                    }
                });
                tasks.Add(t);
            }
            await Task.WhenAll(tasks.ToArray());

            return collection.Flatten();
        }

        private async Task<StockCoproduct> GetStocks(string company, Range range)
        {
            return await range.Match(
                Range.Daily, async _ =>
                {
                    var response = await GetDeserializedIexHttpResponse<List<DailyStock>>(_iex.BaseUrl, $"{company}{_iex.Daily}", _iex.Token);
                    var stocks = response.Get(e => throw new BusinessException(BusinessErrorType.Failure, e.First().Message)).Where(s => s.Volume.SafeNotEquals(0)).OrderByDescending(s => DateTime.Parse(s.Date, CultureInfo.InvariantCulture)).ToList();
                    var stock = stocks.Last();
                    stock.Volume = stocks.Select(s => s.Volume).Aggregate((a, b) => a + b);
                    
                    return new StockCoproduct(stock);
                },
                Range.Historical, async _ =>
                {
                    var response = await GetDeserializedIexHttpResponse<List<Dtos.Stock>>(_iex.BaseUrl, $"{company}{_iex.History}", _iex.Token);

                    return new StockCoproduct(response.Get(e => throw new BusinessException(BusinessErrorType.Failure, e.First().Message)));
                }, 
                Range.Current, async _ =>
                {
                    var result = await GetDeserializedIexHttpResponse<LatestStockResponse>(_iex.BaseUrl, $"{company}{_iex.Current}", _iex.Token, Optimization.Performance);
                    return new StockCoproduct(result.Get(e => e.First()));
                }
            );
        }
    }
}
