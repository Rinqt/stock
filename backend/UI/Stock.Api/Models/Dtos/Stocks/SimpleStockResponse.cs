namespace Stock.Api.Models.Dtos.Stocks
{
    public class SimpleStockResponse : SimpleCompanyAgnosticStockResponse
    {
        public string CompanySymbol { get; set; }
    }
}
