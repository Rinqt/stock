namespace Stock.Components.Articles.Dtos
{
    internal class Article
    {
        public long DateTime { get; set; }

        public string Headline { get; set; }

        public string Source { get; set; }

        public string Url { get; set; }

        public string Summary { get; set; }

        public string Related { get; set; }

        public string Image { get; set; }

        public string Lang { get; set; }

        public bool HasPaywall { get; set; }

        public string Symbol { get; set; }
    }
}
