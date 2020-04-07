using System.ComponentModel.DataAnnotations;

namespace Stock.Api.Models.Dtos.Auth
{
    public class SignUpRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(15, MinimumLength = 5)]
        public string Username { get; set; }

        [Required]
        [RegularExpression(@"^(?=.{8})(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d).*$", ErrorMessage = "Password must have at least one number, one uppercase letter, one lowercase letter. Password must be at least 8 characters long.")]
        public string Password { get; set; }

        [Required]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; }
    }
}
