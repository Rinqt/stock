using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stock.Api.Configuration;
using Stock.Api.Controllers.Shared;
using Stock.Api.Models.Dtos.Companies;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;

namespace Stock.Api.Controllers
{
    [Authorize(Policy = Policies.AdminAllowed)]
    [Route(Routes.BaseRoute + Routes.Companies.Route)]
    public class CompaniesController : ControllerService
    {
        public CompaniesController(ITransaction transaction, IMapper mapper, ILoggerFactory loggerFactory)
            : base(transaction, mapper, loggerFactory)
        {
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string companySymbol)
        {
            return await Transaction(async (c, s) =>
            {
                var company = await c.Companies.GetAsync(s, companySymbol);

                return MapResponse<CompanyResponse>(company);
            });
        }

        [AllowAnonymous]
        [HttpGet]
        [Route(Routes.Companies.All)]
        public async Task<IActionResult> GetAll()
        {
            return await Transaction((c, s) => c.Companies.GetManyAsync(s));
        }
    }
}