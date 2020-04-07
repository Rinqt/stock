using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using Stock.Domain.Entities;

namespace Stock.Application.Infrastructure.Components.Articles
{
    public interface IArticlesComponent
    {
        Task<Article> GetAsync(IClientSessionHandle session, Guid id);

        Task<IEnumerable<Article>> GetManyAsync(IClientSessionHandle session, DateTime from = default, DateTime to = default, string companySymbol = default);

        Task AddNewAsync(IClientSessionHandle session);
    }
}
