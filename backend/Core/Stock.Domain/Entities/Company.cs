using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using FuncSharp;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Stock.Domain.Entities.Interfaces;
using Stock.Domain.Entities.Validations;
using Stock.Utilities.Attributes;
using Stock.Utilities.Helpers.Functions;

namespace Stock.Domain.Entities
{
    public sealed class Company : IEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; private set; }

        public DateTime CreatedAt { get; private set; }

        [BsonRepresentation(BsonType.String)]
        public Guid Version { get; private set; }

        public string Symbol { get; private set; }

        public string Name { get; private set; }

        public string Ceo { get; private set; }

        public string Description { get; private set; }

        public List<string> Tags { get; private set; }

        public string Industry { get; private set; }

        public int? Employees { get; private set; }

        public string Website { get; private set; }

        public string City { get; private set; }

        public string Country { get; private set; }

        private Company(string symbol, string name, string ceo, string description, IEnumerable<string> tags, int? employees, string industry, string website, string city, string country)
        {
            Id = Guid.NewGuid();
            var now = DateTime.UtcNow;
            CreatedAt = new DateTime(now.Year, now.Month, now.Day, 16, kind: DateTimeKind.Utc, minute: 0, second: 0);
            Version = Guid.NewGuid();
            Symbol = symbol;
            Name = name;
            Ceo = ceo;
            Description = description;
            Website = website;
            Tags = tags.ToList();
            Industry = industry;
            Employees = employees;
            City = city;
            Country = country;
        }

        public static ITry<Company> TryCreate(string symbol, string name, string ceo, string description, IEnumerable<string> tags, int? employees, string industry, string website, string city, string country)
        {
            return Actions.TryAction<Company, ValidationException>(_ =>
            {
                var company = new Company(symbol, name, ceo, description, tags, employees, industry, website, city, country);
                company.Validate();
                
                return company;
            });
        }

        public void Validate(IEntity entity)
        {
            var validator = new CompanyValidator();
            validator.Validate((Company)entity);
        }
    }

    public enum CompanySymbol
    {
        [FieldDescription("msft")]
        Microsoft,

        [FieldDescription("tsla")]
        Tesla,

        [FieldDescription("goog")]
        Alphabet,

        [FieldDescription("fb")]
        Facebook,

        [FieldDescription("orcl")]
        Oracle,

        [FieldDescription("aapl")]
        Apple,

        [FieldDescription("amzn")]
        Amazon
    }
}
