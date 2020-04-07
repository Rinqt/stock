using System;
using Stock.Application.Infrastructure.Components.Interfaces;

namespace Stock.Api.Models.Dtos.Articles
{
    public class ArticleResponse : IMappable
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public string CompanySymbol { get; set; }

        public string Source { get; set; }

        public string Title { get; set; }

        public string Image { get; set; }

        public string Link { get; set; }

        public string Content { get; set; }

        public string Polarity { get; set; }
    }
}
