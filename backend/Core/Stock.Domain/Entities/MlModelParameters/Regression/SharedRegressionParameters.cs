namespace Stock.Domain.Entities.MlModelParameters.Regression
{
    public class SharedRegressionParameters : LinearRegressionParameters
    {
        public double Alpha { get; set; }

        public int MaxIteration { get; set; }
    }
}
