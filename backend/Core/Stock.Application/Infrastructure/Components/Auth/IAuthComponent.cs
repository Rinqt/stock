using System.Threading.Tasks;
using Amazon.CognitoIdentityProvider.Model;
using Stock.Utilities.Attributes;

namespace Stock.Application.Infrastructure.Components.Auth
{
    public interface IAuthComponent
    {
        Task<string> SignUpAsync(string email, string username, string password);

        Task<string> ConfirmSignUpAsync(string username, string confirmationCode);

        Task<AuthenticationResultType> SignInAsync(string username, string password);

        Task<string> ForgotPasswordAsync(string username);

        Task<string> ResetPasswordAsync(string username, string newPassword, string confirmationCode);

        Task<string> ChangePasswordAsync(string accessToken, string oldPassword, string newPassword);

        Task<AuthenticationResultType> UpdateTokenAsync(string refreshToken);

        Task<string> SignOutAsync(string accessToken);

        Task<string> DeleteUserAsync(string accessToken);

        Task<string> GetUsernameAsync(string accessToken);

        Task<string> GetUsersEmailAsync(string username);

        Task<bool> IsAdmin(string username);
    }

    public enum Group
    {
        [FieldDescription("Admin")]
        Admin,

        [FieldDescription("User")]
        User
    }
}
