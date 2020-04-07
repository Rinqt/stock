using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FuncSharp;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Stock.Application.Exceptions;
using Stock.Application.Infrastructure.Components.Companies;
using Stock.Application.Infrastructure.Components.Companies.Dtos;
using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Components.Business;
using Stock.Components.Configuration;
using Stock.Domain.Entities;
using Stock.Utilities.Extensions;
using Stock.Utilities.Helpers.Functions;

namespace Stock.Components.Companies
{
    public class CompaniesComponent : BusinessComponent<Company>, ICompaniesComponent
    {
        private readonly Iex _iex;

        public CompaniesComponent(ICompaniesRepository companies, IOptions<Iex> iex)
            :base(companies)
        {
            _iex = iex.Value;
        }

        public async Task AddManyAsync(IClientSessionHandle session)
        {
            var companies = Utilities.Extensions.CollectionExtensions.GetEnumDescriptionValues<CompanySymbol>().ToList();
            var actionResult = await Actions.Throws<IEnumerable<SimpleCompanyResponse>, BusinessException>(_ => GetManyAsync(session));
            await actionResult.Throws.Match(
                async t =>
                {
                    var newCompanies = await FetchCompanies(companies.ToList());
                    await AddManyAsync(session, _ => newCompanies.ToList());
                },
                async f =>
                {
                    var newCompanies = companies.Where(c => actionResult.Value.FirstOrDefault(co => co.Symbol.SafeEquals(c)).SafeEquals(default)).ToList();
                    if (newCompanies.Any())
                    {
                        var @new = await FetchCompanies(newCompanies.ToList());
                        await AddManyAsync(session, _ => @new.ToList());
                    }
                }
            );
        }

        public async Task<Company> GetAsync(IClientSessionHandle session, string companySymbol)
        {
            return await GetAsync(session, b => b.Eq(c => c.Symbol, companySymbol));
        }

        public async Task<IEnumerable<SimpleCompanyResponse>> GetManyAsync(IClientSessionHandle session)
        {
            var companies = await base.GetManyAsync(session);
            
            return companies.Select(c => new SimpleCompanyResponse
            {
                Name = c.Name,
                Symbol = c.Symbol
            });
        }


        private async Task<IEnumerable<Company>> FetchCompanies(IEnumerable<string> companies)
        {
            var collection = new ConcurrentBag<Company>();
            await Task.WhenAll(companies.Select(c => Task.Run(async () =>
            {
                var httpResult = await GetDeserializedIexHttpResponse<Dtos.Company>(_iex.BaseUrl, $"{c}{_iex.Company}", _iex.Token);
                var response = httpResult.Get(e => throw new BusinessException(BusinessErrorType.Failure, e.First().Message));
                var company = Company.TryCreate(response.Symbol.ToLower(), response.CompanyName, response.CEO, response.Description, response.Tags, response.Employees, response.Industry, response.Website, response.City, response.Country);
                company.Success.Match(co => collection.Add(co));
            })).ToArray());

            return collection;
        }
    }
}
