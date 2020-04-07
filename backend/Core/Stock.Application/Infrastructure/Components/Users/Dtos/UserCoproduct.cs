using System;
using System.Collections.Generic;
using FuncSharp;
using Stock.Application.Infrastructure.Components.Interfaces;

namespace Stock.Application.Infrastructure.Components.Users.Dtos
{
    public class UserCoproduct : Coproduct4<User, UsersInfo, UsersSettings, UsersSearchHistory>
    {
        public IOption<User> User => First;

        public IOption<UsersInfo> UsersInfo => Second;

        public IOption<UsersSettings> UsersSettings => Third;

        public IOption<UsersSearchHistory> UsersSearchHistory => Fourth;

        public UserCoproduct(User user)
            : base(user)
        {
        }

        public UserCoproduct(UsersInfo usersInfo)
            : base(usersInfo)
        {
        }

        public UserCoproduct(UsersSettings usersSettings)
            : base(usersSettings)
        {
        }

        public UserCoproduct(UsersSearchHistory usersSearchHistory)
            : base(usersSearchHistory)
        {
        }
    }

    public class User : IMappable
    {
        public Guid Id { get; set; }
    }

    public class UsersInfo : User
    {
        public string Username { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
    }

    public class UsersSettings : User
    {
        public string Username { get; set; }

        public List<Domain.Entities.User.Company> FavoriteCompanies { get; set; }

        public string Language { get; set; }
    }

    public class UsersSearchHistory : User
    {
        public string Username { get; set; }

        public List<Domain.Entities.User.SearchedCompany> SearchedCompanies { get; set; }
    }
}
