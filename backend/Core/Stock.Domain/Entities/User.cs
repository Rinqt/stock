using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using FuncSharp;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Stock.Domain.Entities.Interfaces;
using Stock.Domain.Entities.Validations;
using Stock.Utilities.Helpers.Functions;

namespace Stock.Domain.Entities
{
    public sealed class User : IEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; private set; }

        public DateTime CreatedAt { get; private set; }

        [BsonRepresentation(BsonType.String)]
        public Guid Version { get; private set; }

        public string Username { get; private set; }

        public string FirstName { get; private set; }

        public string LastName { get; private set; }

        public List<Company> FavoriteCompanies { get; private set; }

        public string Language { get; private set; }

        public List<SearchedCompany> SearchedCompanies { get; private set; }

        private User(string username, string firstName, string lastName, IEnumerable<Company> favoriteCompanies, string language, IEnumerable<SearchedCompany> searchedCompanies)
        {
            Id = Guid.NewGuid();
            var now = DateTime.UtcNow;
            CreatedAt = new DateTime(now.Year, now.Month, now.Day, 16, kind: DateTimeKind.Utc, minute: 0, second: 0);
            Version = Guid.NewGuid();
            Username = username;
            FirstName = firstName;
            LastName = lastName;
            FavoriteCompanies = favoriteCompanies.ToNonEmptyOption().Map(c => c.ToList()).GetOrNull();
            Language = language;
            SearchedCompanies = searchedCompanies.ToOption().Map(c => c.ToList()).GetOrElse(_ => Enumerable.Empty<SearchedCompany>().ToList());
        }

        public static ITry<User> TryCreate(string username, string firstName, string lastName, IEnumerable<Company> favoriteCompanies, string language, IEnumerable<SearchedCompany> searchedCompanies)
        {
            return Actions.TryAction<User, ValidationException>(_ =>
            {
                var user = new User(username, firstName, lastName, favoriteCompanies, language, searchedCompanies);
                user.Validate();
                
                return user;
            });
        }

        public void Validate(IEntity entity)
        {
            var validator = new UserValidator();
            validator.Validate((User)entity);
        }

        public class Company
        {
            public string Symbol { get; set; }

            public string Name { get; set; }
        }

        public class SearchedCompany : Company
        {
            public DateTime SearchedAt { get; set; }
        }
    }
}
