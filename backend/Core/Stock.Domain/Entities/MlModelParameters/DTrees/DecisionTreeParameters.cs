namespace Stock.Domain.Entities.MlModelParameters.DTrees
{
    public class DecisionTreeParameters : SharedTreeParameters
    {
        public int RandomState { get; set; }

        public string Splitter { get; set; }

        public bool Presort { get; set; }
    }
}
