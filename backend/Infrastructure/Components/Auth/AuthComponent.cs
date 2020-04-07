using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Amazon;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using FuncSharp;
using Microsoft.Extensions.Options;
using Stock.Application.Exceptions;
using Stock.Application.Infrastructure.Components.Auth;
using Stock.Components.Auth.Configuration;
using Stock.Utilities.Extensions;
using Stock.Utilities.Globalization;
using Stock.Utilities.Globalization.Keys;

namespace Stock.Components.Auth
{
    public class AuthComponent : IAuthComponent
    {
        private readonly Cognito _cognito;
        private readonly RegionEndpoint _region;

        public AuthComponent(IOptions<Cognito> cognito)
        {
            _cognito = cognito.Value;
            _region = RegionEndpoint.GetBySystemName(_cognito.Region);
        }

        public async Task<string> SignUpAsync(string email, string username, string password)
        {
            return await AuthAction(async c =>
            {
                var existingEmails = await GetExistingEmails();

                if (existingEmails.SafeAnyEquals(email))
                {
                    throw new BusinessException(BusinessErrorType.ItemExists, await Localization.GetAsync(Keys.DuplicateEmail));
                }

                var signUpRequest = new SignUpRequest
                {
                    ClientId = _cognito.ClientId,
                    Username = username,
                    Password = password,
                    UserAttributes = new List<AttributeType>
                    {
                        new AttributeType
                        {
                            Name = "email",
                            Value = email
                        }
                    }
                };
                var signUpResponse = await c.SignUpAsync(signUpRequest);

                if (signUpResponse.HttpStatusCode.SafeNotEquals(HttpStatusCode.OK))
                {
                    return "Sign-up attempt unsuccessful.";
                }

                var groupRequest = new AdminAddUserToGroupRequest
                {
                    GroupName = Group.User.GetDescription(),
                    Username = username,
                    UserPoolId = _cognito.PoolId
                };
                var result = await c.AdminAddUserToGroupAsync(groupRequest);

                return result.HttpStatusCode.Match(
                    HttpStatusCode.OK, _ => $"Use the verification code sent to your {signUpResponse.CodeDeliveryDetails.AttributeName}.",
                    _ => "Sign-up attempt unsuccessful."
                );
            });
        }

        public async Task<string> ConfirmSignUpAsync(string username, string confirmationCode)
        {
            return await AuthAction(async c =>
            {
                var request = new ConfirmSignUpRequest
                {
                    ClientId = _cognito.ClientId,
                    Username = username,
                    ConfirmationCode = confirmationCode
                };
                var result = await c.ConfirmSignUpAsync(request);

                return result.HttpStatusCode.Match(
                    HttpStatusCode.OK, _ => "Sign-up successful. You are good to go.",
                    _ => "Sign-up unsuccessful."
                );
            });
        }

        public async Task<AuthenticationResultType> SignInAsync(string username, string password)
        {
            return await AuthAction(async c =>
            {
                var request = new AdminInitiateAuthRequest
                {
                    UserPoolId = _cognito.PoolId,
                    ClientId = _cognito.ClientId,
                    AuthFlow = AuthFlowType.ADMIN_NO_SRP_AUTH
                };
                request.AuthParameters.Add("USERNAME", username);
                request.AuthParameters.Add("PASSWORD", password);
                var response = await c.AdminInitiateAuthAsync(request);

                return response.AuthenticationResult;
            });
        }

        public async Task<string> ForgotPasswordAsync(string username)
        {
            return await AuthAction(async c =>
            {
                var request = new ForgotPasswordRequest
                {
                    ClientId = _cognito.ClientId,
                    Username = username
                };
                var result = await c.ForgotPasswordAsync(request);

                return result.HttpStatusCode.Match(
                    HttpStatusCode.OK, _ => $"Use the verification code sent to your {result.CodeDeliveryDetails.AttributeName}.",
                    _ => "Forgot password attempt unsuccessful."
                );
            });
        }

        public async Task<string> ResetPasswordAsync(string username, string newPassword, string confirmationCode)
        {
            return await AuthAction(async c =>
            {
                var request = new ConfirmForgotPasswordRequest
                {
                    ClientId = _cognito.ClientId,
                    Username = username,
                    Password = newPassword,
                    ConfirmationCode = confirmationCode
                };
                var result = await c.ConfirmForgotPasswordAsync(request);

                return result.HttpStatusCode.Match(
                    HttpStatusCode.OK, _ => "Reset password successful.",
                    _ => "Reset password attempt unsuccessful."
                );
            });
        }

        public async Task<string> ChangePasswordAsync(string accessToken, string oldPassword, string newPassword)
        {
            return await AuthAction(async c =>
            {
                var request = new ChangePasswordRequest
                {
                    AccessToken = accessToken,
                    PreviousPassword = oldPassword,
                    ProposedPassword = newPassword
                };
                var result = await c.ChangePasswordAsync(request);

                return result.HttpStatusCode.Match(
                    HttpStatusCode.OK, _ => "Change password successful.",
                    _ => "Change password attempt unsuccessful."
                );
            });
        }

        public async Task<AuthenticationResultType> UpdateTokenAsync(string refreshToken)
        {
            return await AuthAction(async c =>
            {
                var request = new AdminInitiateAuthRequest
                {
                    UserPoolId = _cognito.PoolId,
                    ClientId = _cognito.ClientId,
                    AuthFlow = AuthFlowType.REFRESH_TOKEN_AUTH
                };
                request.AuthParameters.Add("REFRESH_TOKEN", refreshToken);
                var response = await c.AdminInitiateAuthAsync(request);

                return response.AuthenticationResult;
            });
        }

        public async Task<string> SignOutAsync(string accessToken)
        {
            return await AuthAction(async c =>
            {
                var request = new GlobalSignOutRequest
                {
                    AccessToken = accessToken
                };
                var result = await c.GlobalSignOutAsync(request);

                return result.HttpStatusCode.Match(
                    HttpStatusCode.OK, _ => "Sign out successful.",
                    _ => "Sign out attempt unsuccessful."
                );
            });
        }

        public async Task<string> DeleteUserAsync(string accessToken)
        {
            return await AuthAction(async c =>
            {
                var request = new DeleteUserRequest
                {
                    AccessToken = accessToken
                };
                var result = await c.DeleteUserAsync(request);

                return result.HttpStatusCode.Match(
                    HttpStatusCode.OK, _ => "Delete account successful.",
                    _ => "Delete account attempt unsuccessful."
                );
            });
        }

        public async Task<string> GetUsernameAsync(string accessToken)
        {
            return await AuthAction(async c =>
            {
                var request = new GetUserRequest
                {
                    AccessToken = accessToken
                };
                var response = await c.GetUserAsync(request);

                return response.Username;
            });
        }

        public async Task<string> GetUsersEmailAsync(string username)
        {
            return await AuthAction(async c =>
            {
                var request = new AdminGetUserRequest
                {
                    Username = username,
                    UserPoolId = _cognito.PoolId
                };
                var response = await c.AdminGetUserAsync(request);

                return response.UserAttributes.Find(a => a.Name == "email").Value;
            });
        }

        public async Task<bool> IsAdmin(string username)
        {
            return await AuthAction(async c =>
            {
                var request = new AdminListGroupsForUserRequest
                {
                    Username = username,
                    UserPoolId = _cognito.PoolId
                };
                var response = await c.AdminListGroupsForUserAsync(request);
                var groups = response.Groups.Select(g => g.GroupName);

                return groups.Any(g => g.SafeEquals(Group.Admin.GetDescription()));
            });
        }

        private async Task<IEnumerable<string>> GetExistingEmails()
        {
            return await AuthAction(async c =>
            {
                var request = new ListUsersRequest
                {
                    UserPoolId = _cognito.PoolId
                };
                var response = await c.ListUsersAsync(request);
                
                return response.Users.Select(u => u.Attributes.Find(a => a.Name == "email").Value);
            });
        }

        private async Task<TResult> AuthAction<TResult>(Func<AmazonCognitoIdentityProviderClient, Task<TResult>> action)
        {
            using var client = new AmazonCognitoIdentityProviderClient(_cognito.AccessKey, _cognito.SecretKey, _region);

            return await action(client);
        }
    }
}
