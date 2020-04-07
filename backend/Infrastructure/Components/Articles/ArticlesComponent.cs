using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FuncSharp;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Stock.Application.Exceptions;
using Stock.Application.Infrastructure.Components.Articles;
using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Components.Business;
using Stock.Components.Configuration;
using Stock.Domain.Entities;
using Stock.Domain.Extensions;
using Stock.Utilities.Enumerations;
using Stock.Utilities.Extensions;
using Stock.Utilities.Helpers.Functions;
using Stock.Utilities.Ml;

namespace Stock.Components.Articles
{
    public class ArticlesComponent : BusinessComponent<Article>, IArticlesComponent
    {
        private readonly Iex _iex;

        public ArticlesComponent(IArticlesRepository articles, IOptions<Iex> iex)
            :base(articles)
        {
            _iex = iex.Value;
        }

        public async Task<Article> GetAsync(IClientSessionHandle session, Guid id)
        {
            return await GetAsync(session, b => b.Eq(a => a.Id, id));
        }

        public async Task<IEnumerable<Article>> GetManyAsync(IClientSessionHandle session, DateTime from = default, DateTime to = default, string companySymbol = default)
        {
            return await companySymbol.ToOption().Match(
                async c =>
                {
                    return await GetManyAsync(
                        session,
                        b => b.Where(a => a.CreatedAt >= from && a.CreatedAt <= to && a.CompanySymbol == companySymbol),
                        p => p.Exclude(a => a.Content).Exclude(a => a.Source).Exclude(a => a.Image)
                    );
                },
                async _ =>
                {
                    return await GetManyAsync(
                        session,
                        b => b.Where(a => a.CreatedAt >= from && a.CreatedAt <= to),
                        p => p.Exclude(a => a.Content).Exclude(a => a.Source).Exclude(a => a.Image)
                    );
                }
            );
        }

        public async Task AddNewAsync(IClientSessionHandle session)
        {
            var articles = (await FetchNew()).ToList();
            var actionResult = await Actions.Throws<IEnumerable<Article>, BusinessException>(_ => GetManyAsync(session, to: DateTime.MaxValue));
            await actionResult.Throws.Match(
                async t => await AddManyAsync(session, _ => articles), 
                async f =>
                {
                    var newArticles = articles.Where(a => actionResult.Value.FirstOrDefault(oa => oa.Is(a)).SafeEquals(default)).ToList();
                    if (newArticles.Any())
                    {
                        await AddManyAsync(session, _ => newArticles);
                    }
                }
            );
        }

        private async Task<IEnumerable<Article>> FetchNew()
        {
            var companies = Utilities.Extensions.CollectionExtensions.GetEnumDescriptionValues<CompanySymbol>();
            var collection = new ConcurrentBag<List<Article>>();
            var tasks = new List<Task>();
            foreach (var company in companies)
            {
                var t = Task.Run(async () =>
                {
                    var httpResult = await GetDeserializedIexHttpResponse<List<Dtos.Article>>(_iex.BaseUrl, $"{company}{_iex.News}", _iex.Token);
                    var articles = httpResult.Get(e => throw new BusinessException(BusinessErrorType.Failure, e.First().Message));
                    var innerCollection = new List<Article>();
                    foreach (var article in articles.Where(a => a.Lang.SafeEquals(Language.En.GetDescription())).Select(a =>
                        Article.TryCreate(company, a.Source, a.Headline, a.Image, a.Url, a.Summary, a.Summary.Analyze().GetPolarity()))
                    )
                    {
                        article.Success.Match(a => innerCollection.Add(a));
                    }
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
    }
}
