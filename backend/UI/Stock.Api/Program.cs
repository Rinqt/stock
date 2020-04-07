using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Sentry;
using Serilog;
using Serilog.Events;

namespace Stock.Api
{
    public static class Program
    {
        public static async Task Main(string[] args)
        {
            var hostBuilder = await BuildWebHostAsync(args);
            await hostBuilder.Build().RunAsync();
        }

        private static async Task<IHostBuilder> BuildWebHostAsync(string[] args)
        {
            return await Task.Run(() =>
            {
                return Host.CreateDefaultBuilder(args).ConfigureWebHostDefaults(b =>
                {
                    b.UseContentRoot(Directory.GetCurrentDirectory()).UseIISIntegration().UseStartup<Startup>().UseSerilog((_, c) =>
                    {
                        c.MinimumLevel.Information().MinimumLevel.Override("Microsoft", LogEventLevel.Warning).Enrich.FromLogContext();
                        c.WriteTo.Sentry(o =>
                        {
                            o.MinimumBreadcrumbLevel = LogEventLevel.Warning;
                            o.MinimumEventLevel = LogEventLevel.Warning;
                            o.Dsn = new Dsn(Startup.Configuration["Logging:Dsn"]);
                        });
                    });
                });
            });
        }
    }
}
