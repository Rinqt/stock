using System;
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
    public sealed class Article : IEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; private set; }

        public DateTime CreatedAt { get; private set; }

        [BsonRepresentation(BsonType.String)]
        public Guid Version { get; private set; }

        public string CompanySymbol { get; private set; }

        public string Source { get; private set; }

        public string Title { get; private set; }

        public string Image { get; private set; }

        public string Link { get; private set; }

        public string Content { get; private set; }

        public string Polarity { get; private set; }

        private Article(string companySymbol, string source, string title, string image, string link, string content, string polarity)
        {
            Id = Guid.NewGuid();
            var now = DateTime.UtcNow;
            CreatedAt = new DateTime(now.Year, now.Month, now.Day, 16, kind: DateTimeKind.Utc, minute: 0, second: 0);
            Version = Guid.NewGuid();
            CompanySymbol = companySymbol;
            Source = source;
            Title = title;
            Image = image;
            Link = link;
            Content = content;
            Polarity = polarity;
        }

        public static ITry<Article> TryCreate(string companySymbol, string source, string title, string image, string link, string content, string polarity)
        {
            return Actions.TryAction<Article, ValidationException>(_ =>
            {
                var article = new Article(companySymbol, source, title, image, link, content, polarity);
                article.Validate();
                
                return article;
            });
        }

        public void Validate(IEntity entity)
        {
            var validator = new ArticleValidator();
            validator.Validate((Article)entity);
        }
    }

    public enum Polarity
    {
        [FieldDescription("Positive")]
        Positive,

        [FieldDescription("Negative")]
        Negative,

        [FieldDescription("Neutral")]
        Neutral
    }
}
