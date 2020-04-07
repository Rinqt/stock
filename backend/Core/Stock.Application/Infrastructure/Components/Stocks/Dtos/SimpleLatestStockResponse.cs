namespace Stock.Application.Infrastructure.Components.Stocks.Dtos
{
    public class SimpleLatestStockResponse
    {
        public string CompanySymbol { get; set; }

        public Data Content { get; set; }

        public class Data
        {
            public double? Open { get; set; }

            public double? High { get; set; }

            public double? Low { get; set; }

            public double? Close { get; set; }

            public int? Volume { get; set; }
        }
    }
}
