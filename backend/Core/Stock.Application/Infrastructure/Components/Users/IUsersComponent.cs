using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using Stock.Application.Infrastructure.Components.Users.Dtos;
using User = Stock.Domain.Entities.User;

namespace Stock.Application.Infrastructure.Components.Users
{
    public interface IUsersComponent
    {
        Task<Guid> AddAsync(IClientSessionHandle session, User user);

        Task<UserCoproduct> GetAsync<TUser>(IClientSessionHandle session, string username) where TUser : Dtos.User;

        Task<Guid> UpdateAsync(IClientSessionHandle session, string username, string firstName, string lastName);

        Task<Guid> UpdateAsync(IClientSessionHandle session, string username, IEnumerable<User.Company> favoriteCompanies, string language);

        Task<Guid> UpdateAsync(IClientSessionHandle session, string username, User.SearchedCompany searchedCompany);

        Task<string> DeleteAsync(IClientSessionHandle session, string username);
    }
}
