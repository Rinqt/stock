using System.Collections.Generic;
using Stock.Application.Infrastructure.Components.Interfaces;
using Stock.Domain.Entities;

namespace Stock.Api.Models.Dtos.Users
{
    public class UsersSearchHistory : IMappable
    {
        public List<User.SearchedCompany> SearchedCompanies { get; set; }
    }
}
