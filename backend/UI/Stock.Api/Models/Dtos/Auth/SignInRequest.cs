using System.ComponentModel.DataAnnotations;

namespace Stock.Api.Models.Dtos.Auth
{
    public class SignInRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
