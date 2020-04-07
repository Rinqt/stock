using System.ComponentModel.DataAnnotations;

namespace Stock.Api.Models.Dtos.Auth
{
    public class ForgotPasswordRequest
    {
        [Required]
        public string Username { get; set; }
    }
}
