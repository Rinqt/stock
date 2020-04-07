using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using Stock.Application.Infrastructure.Components.Companies.Dtos;
using Stock.Domain.Entities;

namespace Stock.Application.Infrastructure.Components.Companies
{
    public interface ICompaniesComponent
    {
        Task AddManyAsync(IClientSessionHandle session);

        Task<Company> GetAsync(IClientSessionHandle session, string companySymbol);

        Task<IEnumerable<SimpleCompanyResponse>> GetManyAsync(IClientSessionHandle session);
    }
}
