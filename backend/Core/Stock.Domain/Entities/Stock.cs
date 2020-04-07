using System;
using System.Globalization;
using FluentValidation;
using FuncSharp;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Stock.Domain.Entities.Interfaces;
using Stock.Domain.Entities.Validations;
using Stock.Utilities.Helpers.Functions;

namespace Stock.Domain.Entities
{
    public sealed class Stock : IEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; private set; }

        public DateTime CreatedAt { get; private set; }

        [BsonRepresentation(BsonType.String)]
        public Guid Version { get; private set; }

        public string CompanySymbol { get; private set; }

        public double Open { get; private set; }

        public double High { get; private set; }

        public double Low { get; private set; }

        public double Close { get; private set; }

        public int Volume { get; private set; }

        private Stock(string companySymbol, string date, double open, double high, double low, double close, int volume)
        {
            Id = Guid.NewGuid();
            var parsedDate = DateTime.Parse(date, CultureInfo.InvariantCulture);
            CreatedAt = new DateTime(parsedDate.Year, parsedDate.Month, parsedDate.Day, 16, kind: DateTimeKind.Utc, minute: 0, second: 0);
            Version = Guid.NewGuid();
            CompanySymbol = companySymbol;
            Open = open;
            High = high;
            Low = low;
            Close = close;
            Volume = volume;
        }

        public static ITry<Stock> TryCreate(string companySymbol, string date, double open, double high, double low, double close, int volume)
        {
            return Actions.TryAction<Stock, ValidationException>(_ =>
            {
                var stock = new Stock(companySymbol, date, open, high, low, close, volume);
                stock.Validate();
                
                return stock;
            });
        }

        public void Validate(IEntity entity)
        {
            var validator = new StockValidator();
            validator.Validate((Stock)entity);
        }
    }
}
