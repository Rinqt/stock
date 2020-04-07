using System;
using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using Stock.Application.Infrastructure.Jobs;
using Stock.Application.Infrastructure.Jobs.Articles;
using Stock.Application.Infrastructure.Jobs.Companies;
using Stock.Application.Infrastructure.Jobs.MlModels;
using Stock.Application.Infrastructure.Jobs.Platform.Database;
using Stock.Application.Infrastructure.Jobs.Stocks;

namespace Stock.Api.Configuration
{
    public static class JobCreator
    {
        public static void Create(this IServiceProvider provider)
        {
            foreach (var j in provider.GetJobs())
            {
                j.Create();
            }
        }

        private static IEnumerable<IJob> GetJobs(this IServiceProvider provider)
        {
            using var scope = provider.CreateScope();
            
            yield return scope.ServiceProvider.GetService<IDatabaseJob>();
            yield return scope.ServiceProvider.GetService<IArticlesJob>();
            yield return scope.ServiceProvider.GetService<IStocksJob>();
            yield return scope.ServiceProvider.GetService<ICompaniesJob>();
            yield return scope.ServiceProvider.GetService<IMlModelsJob>();
        }
    }
}
