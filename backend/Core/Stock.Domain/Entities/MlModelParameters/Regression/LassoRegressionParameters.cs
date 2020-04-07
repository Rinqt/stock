namespace Stock.Domain.Entities.MlModelParameters.Regression
{
    public class LassoRegressionParameters : SharedRegressionParameters
    {
        public double Tol { get; set; }

        public bool Positive { get; set; }

        public bool PreCompute { get; set; }

        public bool WarmStart { get; set; }

        public string Selection { get; set; }
    }
}
