namespace Stock.Domain.Entities.MlModelParameters.Regression
{
    public class LassoLarsRegressionParameters : SharedRegressionParameters
    {
        public bool Positive { get; set; }

        public bool PreCompute { get; set; }

        public double Eps { get; set; }

        public bool FitPath { get; set; }
    }
}
