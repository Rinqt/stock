using System;
using Microsoft.Extensions.DependencyInjection;
using Stock.Application.Infrastructure.Components.Articles;
using Stock.Application.Infrastructure.Components.Auth;
using Stock.Application.Infrastructure.Components.Companies;
using Stock.Application.Infrastructure.Components.MlModels;
using Stock.Application.Infrastructure.Components.Stocks;
using Stock.Application.Infrastructure.Components.Users;
using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;
using Stock.Components.Articles;
using Stock.Components.Auth;
using Stock.Components.Auth.Configuration;
using Stock.Components.Companies;
using Stock.Components.MlModels;
using Stock.Components.Stocks;
using Stock.Components.Users;
using Stock.Persistence.Repositories;
using Stock.Persistence.UnitOfWork;
using Stock.Persistence.UnitOfWork.Transactions;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using MongoDB.Bson.Serialization;
using Stock.Application.Infrastructure.Components.Business;
using Stock.Application.Infrastructure.Components.Mailing;
using Stock.Application.Infrastructure.Jobs.Articles;
using Stock.Application.Infrastructure.Jobs.Companies;
using Stock.Application.Infrastructure.Jobs.MlModels;
using Stock.Application.Infrastructure.Jobs.Platform.Database;
using Stock.Application.Infrastructure.Jobs.Stocks;
using Stock.Components.Business;
using Stock.Components.Configuration;
using Stock.Components.Mailing;
using Stock.Components.Mailing.Configuration;
using Stock.Components.MlModels.Configuration;
using Stock.Domain.Entities.MlModelParameters;
using Stock.Domain.Entities.MlModelParameters.DTrees;
using Stock.Domain.Entities.MlModelParameters.Regression;
using Stock.Domain.Entities.MlModelParameters.Rnn;
using Stock.Jobs.Articles;
using Stock.Jobs.Companies;
using Stock.Jobs.MlModels;
using Stock.Jobs.Platform.Database;
using Stock.Jobs.Stocks;
using Mongo = Stock.Persistence.Database.Configuration.Mongo;

namespace Stock.Api.Configuration
{
    public static class Installer
    {
        public static void RegisterPersistence(this IServiceCollection services)
        {
            services.AddScoped<IDbContext, DbContext>();
            services.AddScoped<IArticlesCollectionContext, ArticlesCollectionContext>();
            services.AddScoped<ICompaniesCollectionContext, CompaniesCollectionContext>();
            services.AddScoped<IMlModelsCollectionContext, MlModelsCollectionContext>();
            services.AddScoped<IStocksCollectionContext, StocksCollectionContext>();
            services.AddScoped<IUsersCollectionContext, UsersCollectionContext>();
            services.AddScoped<ITransaction, Transaction>();
            services.AddScoped<IArticlesRepository, ArticlesRepository>();
            services.AddScoped<ICompaniesRepository, CompaniesRepository>();
            services.AddScoped<IMlModelsRepository, MlModelsRepository>();
            services.AddScoped<IStocksRepository, StocksRepository>();
            services.AddScoped<IUsersRepository, UsersRepository>();
        }

        public static void RegisterBsonMapping()
        {
            BsonClassMap.RegisterClassMap<BaseParameters>();
            BsonClassMap.RegisterClassMap<LinearRegressionParameters>();
            BsonClassMap.RegisterClassMap<ElasticRegressionParameters>();
            BsonClassMap.RegisterClassMap<RidgeRegressionParameters>();
            BsonClassMap.RegisterClassMap<BayesianRidgeRegressionParameters>();
            BsonClassMap.RegisterClassMap<LassoRegressionParameters>();
            BsonClassMap.RegisterClassMap<LassoLarsRegressionParameters>();
            BsonClassMap.RegisterClassMap<AdadeltaRnnParameters>();
            BsonClassMap.RegisterClassMap<NadamRnnParameters>();
            BsonClassMap.RegisterClassMap<AdamaxRnnParameters>();
            BsonClassMap.RegisterClassMap<AdamRnnParameters>();
            BsonClassMap.RegisterClassMap<RmsPropRnnParameters>();
            BsonClassMap.RegisterClassMap<SgdRnnParameters>();
            BsonClassMap.RegisterClassMap<DecisionTreeParameters>();
            BsonClassMap.RegisterClassMap<RandomForestParameters>();
        }

        public static void RegisterComponents(this IServiceCollection services)
        {
            services.AddScoped<IBusinessContext, BusinessContext>();
            services.AddScoped<IArticlesComponent, ArticlesComponent>();
            services.AddScoped<IAuthComponent, AuthComponent>();
            services.AddScoped<ICompaniesComponent, CompaniesComponent>();
            services.AddScoped<IMlModelsComponent, MlModelsComponent>();
            services.AddScoped<IStocksComponent, StocksComponent>();
            services.AddScoped<IUsersComponent, UsersComponent>();
            services.AddScoped<IMailingComponent, MailingComponent>();
        }

        public static void RegisterJobs(this IServiceCollection services)
        {
            services.AddScoped<IDatabaseJob, DatabaseJob>();
            services.AddScoped<IArticlesJob, ArticlesJob>();
            services.AddScoped<IStocksJob, StocksJob>();
            services.AddScoped<ICompaniesJob, CompaniesJob>();
            services.AddScoped<IMlModelsJob, MlModelsJob>();
        }

        public static void RegisterConfigurations(this IServiceCollection services)
        {
            services.Configure<Cognito>(Startup.Configuration.GetSection("AWS:Cognito"));
            services.Configure<Iex>(Startup.Configuration.GetSection("Iex"));
            services.Configure<Mongo>(Startup.Configuration.GetSection("Mongo"));
            services.Configure<Ml>(Startup.Configuration.GetSection("Ml"));
            services.Configure<Mailing>(Startup.Configuration.GetSection("Mailing"));
        }

        public static void RegisterMappers(this IServiceCollection services)
        {
            var mapperConfiguration = new MapperConfiguration(c =>
            {
                c.AddProfile(new Mappers.RequestMapper());
                c.AddProfile(new Mappers.ResponseMapper());
            });
            services.AddSingleton(mapperConfiguration.CreateMapper());
        }

        public static void ConfigureAuth(this IServiceCollection services)
        {
            Auth.Configure(services);
        }

        public static void ConfigureJobServer(this IServiceCollection services, string connectionString)
        {
            JobServer.Configure(services, connectionString);
        }

        public static void ConfigureJobServer(this IApplicationBuilder app, IServiceProvider provider, string path)
        {
            JobServer.Configure(app, provider, path);
        }

        public static void ConfigureSwagger(this IServiceCollection services)
        {
            Swagger.Configure(services);
        }

        public static void ConfigureCors(this IServiceCollection services, string policyName)
        {
            Cors.Configure(services, policyName);
        }

        public static void ConfigureCors(this IApplicationBuilder app, string policyName)
        {
            Cors.Configure(app, policyName);
        }

        public static void ConfigureEndpoints(this IApplicationBuilder app)
        {
            app.UseHsts();
            app.UseHttpsRedirection();
            app.UseRouting();
            Auth.Configure(app);
            Swagger.Configure(app);
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
