using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Stock.Api.Configuration
{
    public static class Cors
    {
        public static void Configure(IServiceCollection services, string policyName)
        {
            services.AddCors(o => o.AddPolicy(policyName, b =>
            {
                b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));
        }

        public static void Configure(IApplicationBuilder app, string policyName)
        {
            app.UseCors(policyName);
        }
    }
}
