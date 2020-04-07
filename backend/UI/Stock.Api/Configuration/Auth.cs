using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FuncSharp;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Stock.Application.Infrastructure.Components.Auth;
using Stock.Utilities.Extensions;

namespace Stock.Api.Configuration
{
    public static class Auth
    {
        public static void Configure(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
            {
                o.Audience = Startup.Configuration["AWS:Cognito:ClientId"];
                o.Authority = $"{Startup.Configuration["AWS:Cognito:BaseUrl"]}{Startup.Configuration["AWS:Cognito:PoolId"]}";
            });
            services.AddAuthorization(o =>
            {
                o.AddPolicy(Policies.AllAllowed, p => p.Requirements.Add(new GroupRequirement()));
                o.AddPolicy(Policies.AdminAllowed, p => p.Requirements.Add(new GroupRequirement(Group.Admin.GetDescription())));
                o.AddPolicy(Policies.UserAllowed, p => p.Requirements.Add(new GroupRequirement(Group.User.GetDescription())));
            });
            services.AddSingleton<IAuthorizationHandler, AuthHandler>();
        }

        public static void Configure(IApplicationBuilder app)
        {
            app.UseAuthentication();
            app.UseAuthorization();
        }
    }

    internal sealed class AuthHandler : AuthorizationHandler<GroupRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, GroupRequirement requirement)
        {
            var claims = context.User.Claims.ToList();
            var group = claims.FirstOrDefault(c => c.Type.SafeEquals("cognito:groups"))?.Value;

            return requirement.Satisfied(group).Match(
                t =>
                {
                    context.Succeed(requirement);
                    return Task.CompletedTask;
                },
                f =>
                {
                    context.Fail();
                    return Task.CompletedTask;
                }
            );
        }
    }

    internal sealed class GroupRequirement : IAuthorizationRequirement
    {
        private readonly IEnumerable<string> _groups;

        public GroupRequirement(params string[] groups)
        {
            _groups = groups.ToList();
        }

        public GroupRequirement()
        {
            _groups = Utilities.Extensions.CollectionExtensions.GetEnumDescriptionValues<Group>();
        }

        public bool Satisfied(string group)
        {
            return _groups.Any(g => g.SafeEquals(group));
        }
    }
}
