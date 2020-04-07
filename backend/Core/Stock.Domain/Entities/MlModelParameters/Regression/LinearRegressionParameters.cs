namespace Stock.Domain.Entities.MlModelParameters.Regression
{
    public class LinearRegressionParameters : BaseParameters
    {
        public int RandomState { get; set; }

        public bool FitIntercept { get; set; }

        public bool Normalize { get; set; }
    }
}
