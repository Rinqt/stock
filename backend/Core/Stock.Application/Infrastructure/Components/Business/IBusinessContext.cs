using Stock.Application.Infrastructure.Components.Articles;
using Stock.Application.Infrastructure.Components.Auth;
using Stock.Application.Infrastructure.Components.Companies;
using Stock.Application.Infrastructure.Components.Mailing;
using Stock.Application.Infrastructure.Components.MlModels;
using Stock.Application.Infrastructure.Components.Stocks;
using Stock.Application.Infrastructure.Components.Users;

namespace Stock.Application.Infrastructure.Components.Business
{
    /// <summary>
    /// Represents a component pool. All components should be registered here.
    /// </summary>
    public interface IBusinessContext
    {
        IArticlesComponent Articles { get; }

        IAuthComponent Auth { get; }

        ICompaniesComponent Companies { get; }

        IMlModelsComponent MlModels { get; }

        IStocksComponent Stocks { get; }

        IUsersComponent Users { get; }

        IMailingComponent Mailing { get; }
    }
}
