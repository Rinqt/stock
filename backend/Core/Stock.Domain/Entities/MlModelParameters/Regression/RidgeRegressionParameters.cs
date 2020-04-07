namespace Stock.Domain.Entities.MlModelParameters.Regression
{
    public class RidgeRegressionParameters : SharedRegressionParameters
    {
        public double Tol { get; set; }

        public string Solver { get; set; }
    }
}
