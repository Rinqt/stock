using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stock.Api.Configuration;
using Stock.Api.Controllers.Shared;
using Stock.Api.Models.Dtos.Users;
using Stock.Application.Infrastructure.Components.Users.Dtos;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;
using Stock.Utilities.Exceptions;
using Stock.Utilities.Globalization;
using Stock.Utilities.Globalization.Keys;

namespace Stock.Api.Controllers
{
    [Authorize(Policy = Policies.UserAllowed)]
    [Route(Routes.BaseRoute + Routes.Users.Route)]
    public class UsersController : ControllerService
    {
        public UsersController(ITransaction transaction, IMapper mapper, ILoggerFactory loggerFactory)
            : base(transaction, mapper, loggerFactory)
        {
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route(Routes.Users.Info)]
        public async Task<IActionResult> GetUsersInfo()
        {
            return await UserTransaction(async (c, s, u) => MapResponse<UsersBasicInfo>((await c.Users.GetAsync<UsersInfo>(s, u)).UsersInfo));
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route(Routes.Users.Settings)]
        public async Task<IActionResult> GetUsersSettings()
        {
            return await UserTransaction(async (c, s, u) => MapResponse<UsersBasicSettings>((await c.Users.GetAsync<UsersSettings>(s, u)).UsersSettings));
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route(Routes.Users.SearchHistory)]
        public async Task<IActionResult> GetUsersSearchHistory()
        {
            return await UserTransaction(async (c, s, u) => MapResponse<Models.Dtos.Users.UsersSearchHistory>((await c.Users.GetAsync<Application.Infrastructure.Components.Users.Dtos.UsersSearchHistory>(s, u)).UsersSearchHistory));
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPut]
        [Route(Routes.Users.Info)]
        public async Task<IActionResult> UpdateUsersInfo([FromBody] UsersBasicInfo info)
        {
            return await UserTransaction(async (c, s, u) =>
            {
                await c.Users.UpdateAsync(s, u, info.FirstName, info.LastName);

                return MapResponse<UsersBasicInfo>((await c.Users.GetAsync<UsersInfo>(s, u)).UsersInfo);
            });
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <param name="settings"></param>
        /// <returns></returns>
        [HttpPut]
        [Route(Routes.Users.Settings)]
        public async Task<IActionResult> UpdateUsersSettings([FromBody] UsersBasicSettings settings)
        {
            return await UserTransaction(async (c, s, u) =>
            {
                await c.Users.UpdateAsync(s, u, MapRequest<Company, Domain.Entities.User.Company>(settings.FavoriteCompanies), settings.Language);

                return MapResponse<UsersBasicSettings>((await c.Users.GetAsync<UsersSettings>(s, u)).UsersSettings);
            });
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <param name="history"></param>
        /// <returns></returns>
        [HttpPut]
        [Route(Routes.Users.SearchHistory)]
        public async Task<IActionResult> UpdateUsersSearchHistory([FromBody] UsersBasicSearchHistory history)
        {
            return await UserTransaction(async (c, s, u) =>
            {
                await c.Users.UpdateAsync(s, u, MapRequest<Company, Domain.Entities.User.SearchedCompany>(history.SearchedCompany));

                return MapResponse<Models.Dtos.Users.UsersSearchHistory>((await c.Users.GetAsync<Application.Infrastructure.Components.Users.Dtos.UsersSearchHistory>(s, u)).UsersSearchHistory);
            });
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <returns></returns>
        [HttpDelete]
        public async Task<IActionResult> Delete()
        {
            return await AuthorizedTransaction(async(c, s, h) =>
            {
                var username = await c.Auth.GetUsernameAsync(h.AccessToken);
                var userId = (await c.Users.GetAsync<User>(s, username)).User.Get(_ => throw new InternalException(InternalErrorType.IncorrectBehavior, Localization.Get(Keys.InvalidCoproduct))).Id;
                await c.MlModels.DeleteManyAsync(s, userId);
                await c.Users.DeleteAsync(s, username);

                return await c.Auth.DeleteUserAsync(h.AccessToken);
            });
        }
    }
}