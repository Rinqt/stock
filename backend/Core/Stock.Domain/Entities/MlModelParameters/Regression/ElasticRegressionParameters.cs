namespace Stock.Domain.Entities.MlModelParameters.Regression
{
    public class ElasticRegressionParameters : SharedRegressionParameters
    {
        public double L1Ratio { get; set; }

        public double Tol { get; set; }

        public bool Positive { get; set; }

        public bool PreCompute { get; set; }

        public bool WarmStart { get; set; }

        public string Selection { get; set; }
    }
}
