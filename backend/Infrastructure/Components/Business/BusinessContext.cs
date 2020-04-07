using Stock.Application.Infrastructure.Components.Articles;
using Stock.Application.Infrastructure.Components.Auth;
using Stock.Application.Infrastructure.Components.Business;
using Stock.Application.Infrastructure.Components.Companies;
using Stock.Application.Infrastructure.Components.Mailing;
using Stock.Application.Infrastructure.Components.MlModels;
using Stock.Application.Infrastructure.Components.Stocks;
using Stock.Application.Infrastructure.Components.Users;

namespace Stock.Components.Business
{
    public sealed class BusinessContext : IBusinessContext
    {
        public IAuthComponent Auth { get; }

        public IArticlesComponent Articles { get; }

        public ICompaniesComponent Companies { get; }

        public IMlModelsComponent MlModels { get; }

        public IStocksComponent Stocks { get; }

        public IUsersComponent Users { get; }

        public IMailingComponent Mailing { get; }

        public BusinessContext(
            IArticlesComponent articles,
            IAuthComponent auth,
            ICompaniesComponent companies,
            IMlModelsComponent mlModels,
            IStocksComponent stocks,
            IUsersComponent users,
            IMailingComponent mailing)
        {
            Auth = auth;
            Articles = articles;
            Companies = companies;
            MlModels = mlModels;
            Stocks = stocks;
            Users = users;
            Mailing = mailing;
        }
    }
}
