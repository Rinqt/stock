using System.Collections.Generic;
using Stock.Domain.Entities.MlModelParameters.Interfaces;

namespace Stock.Domain.Entities.MlModelParameters
{
    public class BaseParameters : IMlModelParameters
    {
        public string CompanySymbol { get; set; }

        public int ForecastOut { get; set; }

        public List<string> Features { get; set; }

        public string FeatureToPredict { get; set; }

        public double TestSize { get; set; }
    }
}
