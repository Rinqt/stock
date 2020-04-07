using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using Stock.Application.Infrastructure.Components.Stocks.Dtos;
using Stock.Utilities.Attributes;

namespace Stock.Application.Infrastructure.Components.Stocks
{
    public interface IStocksComponent
    {
        Task<IEnumerable<Domain.Entities.Stock>> GetManyAsync(IClientSessionHandle session, DateTime from = default, DateTime to = default, string companySymbol = default);

        Task<IEnumerable<SimpleLatestStockResponse>> GetLatestAsync(IEnumerable<string> companies);

        Task AddNewAsync(IClientSessionHandle session, Range range);
    }

    public enum Range
    {
        [FieldDescription("Daily")]
        Daily,

        [FieldDescription("Historical")]
        Historical,

        [FieldDescription("Current")]
        Current
    }
}
