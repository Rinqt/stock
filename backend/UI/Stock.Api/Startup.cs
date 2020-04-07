using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Stock.Api.Configuration;

namespace Stock.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public static IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.ConfigureCors("CorsPolicy");
            services.AddControllers().AddNewtonsoftJson();
            services.ConfigureAuth();
            services.ConfigureJobServer($"{Configuration["Mongo:Connection"]}");
            services.RegisterConfigurations();
            services.RegisterPersistence();
            Installer.RegisterBsonMapping();
            services.RegisterComponents();
            services.RegisterJobs();
            services.RegisterMappers();
            services.ConfigureSwagger();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IServiceProvider provider)
        {
            app.ConfigureJobServer(provider, "/jobs");
            provider.Create();
            app.ConfigureCors("CorsPolicy");
            app.ConfigureEndpoints();
        }
    }
}
