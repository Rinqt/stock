using System.ComponentModel.DataAnnotations;

namespace Stock.Api.Models.Dtos.Auth
{
    public class ResetPasswordRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [RegularExpression(@"^(?=.{8})(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d).*$", ErrorMessage = "Password must have at least one number, one uppercase letter, one lowercase letter. Password must be at least 8 characters long.")]
        public string NewPassword { get; set; }

        [Required]
        public string ConfirmationCode { get; set; }
    }
}
