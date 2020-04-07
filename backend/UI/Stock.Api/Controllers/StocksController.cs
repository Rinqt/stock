using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FuncSharp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stock.Api.Configuration;
using Stock.Api.Controllers.Shared;
using Stock.Api.Models.Dtos.Stocks;
using Stock.Application.Infrastructure.Components.Users.Dtos;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;
using Stock.Utilities.Exceptions;
using Stock.Utilities.Extensions;
using Stock.Utilities.Globalization;
using Stock.Utilities.Globalization.Keys;

namespace Stock.Api.Controllers
{
    [Route(Routes.BaseRoute + Routes.Stocks.Route)]
    public sealed class StocksController : ControllerService
    {
        public StocksController(ITransaction transaction, IMapper mapper, ILoggerFactory loggerFactory)
            : base(transaction, mapper, loggerFactory)
        {
        }

        [HttpGet]
        [Route(Routes.Stocks.Latest)]
        public async Task<IActionResult> GetLatest()
        {
            return await OptionalAuthorizedTransaction(async (c, s, h) =>
            {
                var companies = await h.Match(
                    async he =>
                    {
                        var username = await c.Auth.GetUsernameAsync(he.AccessToken);
                        var usersSettings = (await c.Users.GetAsync<UsersSettings>(s, username)).UsersSettings.Get(_ => throw new InternalException(InternalErrorType.IncorrectBehavior, Localization.Get(Keys.InvalidCoproduct)));
                        var allCompanies = await c.Companies.GetManyAsync(s);
                        
                        return usersSettings.FavoriteCompanies.ToNonEmptyOption().Map(co => co.Select(com => com.Symbol)).GetOrElse(_ => allCompanies.Select(co => co.Symbol));
                    },
                    async _ => (await c.Companies.GetManyAsync(s)).Select(co => co.Symbol)
                );

                return await c.Stocks.GetLatestAsync(companies);
            });
        }

        [HttpGet]
        [Route(Routes.Stocks.All)]
        public async Task<IActionResult> GetAll([FromQuery] DateTime from = default, [FromQuery] DateTime to = default, [FromQuery] string companySymbol = default)
        {
            return await Transaction(async (c, s) =>
            {
                var stocks = await c.Stocks.GetManyAsync(s, from, to.SafeEquals(default).Match(t => DateTime.MaxValue, f => to), companySymbol);
                
                return companySymbol.SafeEquals(default) ? MapResponse<SimpleStockResponse>(stocks) : MapResponse<SimpleCompanyAgnosticStockResponse>(stocks);
            });
        }
    }
}