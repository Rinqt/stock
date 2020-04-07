using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FuncSharp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stock.Api.Configuration;
using Stock.Api.Controllers.Shared;
using Stock.Api.Models.Dtos.Articles;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;
using Stock.Utilities.Extensions;

namespace Stock.Api.Controllers
{
    [Route(Routes.BaseRoute + Routes.Articles.Route)]
    public sealed class ArticlesController : ControllerService
    {
        public ArticlesController(ITransaction transaction, IMapper mapper, ILoggerFactory loggerFactory)
            : base(transaction, mapper, loggerFactory)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] Guid id)
        {
            return await Transaction(async (c, s) =>
            {
                var article = await c.Articles.GetAsync(s, id);

                return MapResponse<ArticleResponse>(article);
            });
        }

        [HttpGet]
        [Route(Routes.Articles.All)]
        public async Task<IActionResult> GetAll([FromQuery] DateTime from = default, [FromQuery] DateTime to = default, [FromQuery] string companySymbol = default)
        {
            return await Transaction(async (c, s) =>
            {
                var articles = await c.Articles.GetManyAsync(s, from, to.SafeEquals(default).Match(t => DateTime.MaxValue, f => to), companySymbol);

                return MapResponse<SimpleArticleResponse>(articles.OrderByDescending(a => a.CreatedAt));
            });
        }
    }
}