namespace Stock.Domain.Entities.MlModelParameters.Regression
{
    public class BayesianRidgeRegressionParameters : SharedRegressionParameters
    {
        public double Tol { get; set; }

        public double Alpha2 { get; set; }

        public double Lambda1 { get; set; }

        public double Lambda2 { get; set; }

        public bool ComputeScore { get; set; }
    }
}
