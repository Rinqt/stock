using System.Linq;
using System.Threading.Tasks;
using FuncSharp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stock.Api.Configuration;
using Stock.Api.Controllers.Shared;
using Stock.Api.Models.Dtos.Auth;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;
using Stock.Utilities.Enumerations;
using Stock.Utilities.Extensions;

namespace Stock.Api.Controllers
{
    [Authorize]
    [Route(Routes.BaseRoute + Routes.Auth.Route)]
    public class AuthController : ControllerService
    {
        public AuthController(ITransaction transaction, ILoggerFactory loggerFactory)
            : base(transaction, loggerFactory)
        {
        }

        [AllowAnonymous]
        [HttpPost]
        [Route(Routes.Auth.SignUp)]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            return await AuthOnlyAction(a => a.SignUpAsync(request.Email, request.Username, request.Password));
        }

        [AllowAnonymous]
        [HttpPost]
        [Route(Routes.Auth.ConfirmSignUp)]
        public async Task<IActionResult> ConfirmSignUp([FromBody] ConfirmSignUpRequest request)
        {
            return await Transaction(async (c, s) =>
            {
                var result = Domain.Entities.User.TryCreate(request.Username, default, default, default, Language.En.GetDescription(), default);
                var user = result.Get(e => e.First());
                await c.Users.AddAsync(s, user);
                
                return await c.Auth.ConfirmSignUpAsync(user.Username, request.ConfirmationCode);
            });
        }

        [AllowAnonymous]
        [HttpPost]
        [Route(Routes.Auth.SignIn)]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            return await AuthOnlyAction(a => a.SignInAsync(request.Username, request.Password));
        }

        [AllowAnonymous]
        [HttpPost]
        [Route(Routes.Auth.ForgotPassword)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            return await AuthOnlyAction(a => a.ForgotPasswordAsync(request.Username));
        }

        [AllowAnonymous]
        [HttpPost]
        [Route(Routes.Auth.ResetPassword)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            return await AuthOnlyAction(a => a.ResetPasswordAsync(request.Username, request.NewPassword, request.ConfirmationCode));
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [Route(Routes.Auth.ChangePassword)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            return await AuthorizedAuthOnlyAction((a, h) => a.ChangePasswordAsync(h.AccessToken, request.OldPassword, request.NewPassword));
        }

        [HttpPost]
        [Route(Routes.Auth.UpdateToken)]
        public async Task<IActionResult> UpdateToken([FromBody] UpdateTokenRequest request)
        {
            return await AuthOnlyAction(a => a.UpdateTokenAsync(request.RefreshToken));
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route(Routes.Auth.SignOut)]
        public async Task<IActionResult> SignOut()
        {
            return await AuthorizedAuthOnlyAction((a, h) => a.SignOutAsync(h.AccessToken));
        }
    }
}