using System.ComponentModel.DataAnnotations;

namespace Stock.Api.Models.Dtos.Users
{
    public class UsersBasicSearchHistory
    {
        [Required]
        public Company SearchedCompany { get; set; }
    }
}
