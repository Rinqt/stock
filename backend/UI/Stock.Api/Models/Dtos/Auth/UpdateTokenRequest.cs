using System.ComponentModel.DataAnnotations;

namespace Stock.Api.Models.Dtos.Auth
{
    public class UpdateTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; }
    }
}
