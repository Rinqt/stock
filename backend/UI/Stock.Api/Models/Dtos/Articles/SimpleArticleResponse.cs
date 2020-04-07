using System;
using Stock.Application.Infrastructure.Components.Interfaces;

namespace Stock.Api.Models.Dtos.Articles
{
    public class SimpleArticleResponse : IMappable
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public string CompanySymbol { get; set; }

        public string Title { get; set; }

        public string Polarity { get; set; }
    }
}
