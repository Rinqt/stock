using System.Collections.Generic;

namespace Stock.Domain.Entities.MlModelParameters.Interfaces
{
    public interface IMlModelParameters
    {
        public string CompanySymbol { get; set; }

        public int ForecastOut { get; set; }

        public List<string> Features { get; set; }

        public string FeatureToPredict { get; set; }

        public double TestSize { get; set; }
    }
}