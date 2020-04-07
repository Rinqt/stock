using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FuncSharp;
using MongoDB.Driver;
using Stock.Application.Infrastructure.Components.Users;
using Stock.Application.Infrastructure.Components.Users.Dtos;
using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Components.Business;
using Stock.Utilities.Exceptions;
using Stock.Utilities.Extensions;
using Stock.Utilities.Globalization;
using Stock.Utilities.Globalization.Keys;
using User = Stock.Domain.Entities.User;

namespace Stock.Components.Users
{
    public class UsersComponent : BusinessComponent<User>, IUsersComponent
    {
        public UsersComponent(IUsersRepository users)
            : base(users)
        {
        }

        public async Task<Guid> AddAsync(IClientSessionHandle session, User user)
        {
            return await AddAsync(session, _ => user);
        }

        public async Task<UserCoproduct> GetAsync<TUser>(IClientSessionHandle session, string username) where TUser: Application.Infrastructure.Components.Users.Dtos.User
        {
            return await typeof(TUser).Match(
                typeof(Application.Infrastructure.Components.Users.Dtos.User), async _ =>
                {
                    var user = await GetAsync(session, b => b.Eq(u => u.Username, username), p => p.Include(u => u.Id));
                    
                    return new UserCoproduct(new Application.Infrastructure.Components.Users.Dtos.User
                    {
                        Id = user.Id
                    });
                },
                typeof(UsersInfo), async _ =>
                {
                    var user = await GetAsync(session, b => b.Eq(u => u.Username, username), p => p.Include(u => u.Id).Include(u => u.Username).Include(u => u.FirstName).Include(u => u.LastName));
                    
                    return new UserCoproduct(new UsersInfo
                    {
                        Username = user.Username,
                        FirstName = user.FirstName,
                        LastName = user.LastName
                    });
                },
                typeof(UsersSettings), async _ =>
                {
                    var user = await GetAsync(session, b => b.Eq(u => u.Username, username), p => p.Include(u => u.Id).Include(u => u.Username).Include(u => u.FavoriteCompanies).Include(u => u.Language));
                    
                    return new UserCoproduct(new UsersSettings
                    {
                        Username = user.Username,
                        FavoriteCompanies = user.FavoriteCompanies,
                        Language = user.Language
                    });
                },
                typeof(UsersSearchHistory), async _ =>
                {
                    var user = await GetAsync(session, b => b.Eq(u => u.Username, username), p => p.Include(u => u.Id).Include(u => u.Username).Include(u => u.SearchedCompanies));
                    
                    return new UserCoproduct(new UsersSearchHistory
                    {
                        Username = user.Username,
                        SearchedCompanies = user.SearchedCompanies.OrderByDescending(c => c.SearchedAt).ToList()
                    });
                }
            );
        }

        public async Task<Guid> UpdateAsync(IClientSessionHandle session, string username, string firstName, string lastName)
        {
            return await UpdateAsync(session, username, u => u
                .Set(nameof(User.FirstName), firstName)
                .Set(nameof(User.LastName), lastName)
            );
        }

        public async Task<Guid> UpdateAsync(IClientSessionHandle session, string username, IEnumerable<User.Company> favoriteCompanies, string language)
        {
            return await UpdateAsync(session, username, u => u
                .Set(nameof(User.FavoriteCompanies), favoriteCompanies)
                .Set(nameof(User.Language), language)
            );
        }

        public async Task<Guid> UpdateAsync(IClientSessionHandle session, string username, User.SearchedCompany searchedCompany)
        {
            var user = (await GetAsync<UsersSearchHistory>(session, username)).UsersSearchHistory.Get(_ => throw new InternalException(InternalErrorType.IncorrectBehavior, Localization.Get(Keys.InvalidCoproduct)));
            var searchedCompanies = user.SearchedCompanies;
            var possibleDuplicates = searchedCompanies.Where(c => c.Symbol.SafeEquals(searchedCompany.Symbol)).ToList();
            if (possibleDuplicates.Any())
            {
                searchedCompanies = searchedCompanies.Except(possibleDuplicates).ToList();
            }
            searchedCompanies.Add(searchedCompany);
            
            return await UpdateAsync(session, username, b => b
                .Set(nameof(User.SearchedCompanies), searchedCompanies)
            );
        }

        private async Task<Guid> UpdateAsync(IClientSessionHandle session, string username, Func<UpdateDefinitionBuilder<User>, UpdateDefinition<User>> updateDefinitionPredicate)
        {
            return await UpdateAsync(
                session,
                b => b.Eq(u => u.Username, username), 
                updateDefinitionPredicate
            );
        }

        public async Task<string> DeleteAsync(IClientSessionHandle session, string username)
        {
            var result = await DeleteAsync(session, b => b.Eq(u => u.Username, username));

            return result.Match(Unit.Value, _ => "Delete user successful.");
        }
    }
}
