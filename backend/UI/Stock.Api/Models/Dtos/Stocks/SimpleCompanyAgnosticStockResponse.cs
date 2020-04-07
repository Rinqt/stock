using Stock.Application.Infrastructure.Components.Interfaces;

namespace Stock.Api.Models.Dtos.Stocks
{
    public class SimpleCompanyAgnosticStockResponse : IMappable
    {
        public string CreatedAt { get; set; }

        public double Open { get; set; }

        public double High { get; set; }

        public double Low { get; set; }

        public double Close { get; set; }

        public int Volume { get; set; }
    }
}
