using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Stock.Application.Infrastructure.Components.Interfaces;

namespace Stock.Api.Models.Dtos.Users
{
    public class UsersBasicSettings : IMappable
    {
        [Required]
        public List<Company> FavoriteCompanies { get; set; }

        [Required]
        public string Language { get; set; }
    }

    public class Company : IMappable
    {
        [Required]
        public string Symbol { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
