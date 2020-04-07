using System;
using Hangfire;
using Hangfire.AspNetCore;
using Hangfire.Dashboard;
using Hangfire.Heartbeat;
using Hangfire.Heartbeat.Server;
using Hangfire.Mongo;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Stock.Utilities.Extensions;

namespace Stock.Api.Configuration
{
    public static class JobServer
    {
        public static void Configure(IServiceCollection services, string connectionString)
        {
            services.AddHangfire(c =>
            {
                c.UseMongoStorage(connectionString, new MongoStorageOptions
                {
                    Prefix = "Job",
                    MigrationOptions = new MongoMigrationOptions
                    {
                        Strategy = MongoMigrationStrategy.Migrate,
                        BackupStrategy = MongoBackupStrategy.Collections
                    }
                });
                c.UseHeartbeatPage(TimeSpan.FromSeconds(2));
            });
        }

        public static void Configure(IApplicationBuilder app, IServiceProvider provider, string path)
        {
            GlobalConfiguration.Configuration.UseActivator(new AspNetCoreJobActivator(provider.GetService<IServiceScopeFactory>()));

            app.UseHangfireServer(
                new BackgroundJobServerOptions
                {
                    WorkerCount = 20
                },
                new[] { new ProcessMonitor(TimeSpan.FromSeconds(2)) }
            );
            app.UseHangfireDashboard(path, new DashboardOptions
            {
                DashboardTitle = "Dashboard",
                AppPath = "https://www.predictfuturestocks.com",
                DisplayStorageConnectionString = false,
                Authorization = new[] { new AuthFilter() }
            });
        }
    }

    public class AuthFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            var httpContext = context.GetHttpContext();
            var success = httpContext.Request.Headers.TryGetValue("SecretKey", out var value);
            if (success.SafeNotEquals(true))
            {
                return false;
            }
            var secretKey = $"{Startup.Configuration["JobServer:SecretKey"]}";
            
            return value.ToString().SafeEquals(secretKey);
        }
    }
}
