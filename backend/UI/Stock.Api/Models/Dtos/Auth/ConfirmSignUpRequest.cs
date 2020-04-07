using System.ComponentModel.DataAnnotations;

namespace Stock.Api.Models.Dtos.Auth
{
    public class ConfirmSignUpRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string ConfirmationCode { get; set; }
    }
}
