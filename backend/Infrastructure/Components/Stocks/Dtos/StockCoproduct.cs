using System.Collections.Generic;
using FuncSharp;

namespace Stock.Components.Stocks.Dtos
{
    /// <summary>
    /// Coproduct of 3. Stock collection, DailyStock and LatestStockResponse.
    /// </summary>
    public class StockCoproduct : Coproduct3<IEnumerable<Stock>, DailyStock, LatestStockResponse>
    {
        public IOption<IEnumerable<Stock>> Stocks => First;

        public IOption<DailyStock> DailyStock => Second;

        public IOption<LatestStockResponse> LatestStockResponse => Third;

        public StockCoproduct(IEnumerable<Stock> stocks)
            : base(stocks)
        {
        }

        public StockCoproduct(DailyStock stock)
            : base(stock)
        {
        }

        public StockCoproduct(LatestStockResponse stock)
            : base(stock)
        {
        }
    }

    public class Stock
    {
        public string Date { get; set; }

        public double Open { get; set; }

        public double High { get; set; }

        public double Low { get; set; }

        public double Close { get; set; }

        public int Volume { get; set; }

        public int UnadjustedVolume { get; set; }

        public double Change { get; set; }

        public double ChangePercent { get; set; }

        public double Vwap { get; set; }

        public double ChangeOverTime { get; set; }
    }

    public class DailyStock
    {
        public string Date { get; set; }

        public string Minute { get; set; }

        public string Label { get; set; }

        public double? Open { get; set; }

        public double? High { get; set; }

        public double? Low { get; set; }

        public double? Close { get; set; }

        public double? Average { get; set; }

        public int Volume { get; set; }

        public double Notional { get; set; }

        public int NumberOfTrades { get; set; }
    }

    public class LatestStockResponse
    {
        public string Range { get; set; }

        public List<LatestStock> Data { get; set; }

        public class LatestStock
        {
            public string Date { get; set; }

            public string Minute { get; set; }

            public string Label { get; set; }

            public double? High { get; set; }

            public double? Low { get; set; }

            public double? Average { get; set; }

            public int? Volume { get; set; }

            public double? Notional { get; set; }

            public int? NumberOfTrades { get; set; }

            public double? MarketHigh { get; set; }

            public double? MarketLow { get; set; }

            public double? MarketAverage { get; set; }

            public int? MarketVolume { get; set; }

            public double? MarketNotional { get; set; }

            public int? MarketNumberOfTrades { get; set; }

            public double? Open { get; set; }

            public double? Close { get; set; }

            public double? MarketOpen { get; set; }

            public double? MarketClose { get; set; }

            public double? ChangeOverTime { get; set; }

            public double? MarketChangeOverTime { get; set; }
        }
    }
}
