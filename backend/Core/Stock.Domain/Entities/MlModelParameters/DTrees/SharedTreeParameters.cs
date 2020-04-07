namespace Stock.Domain.Entities.MlModelParameters.DTrees
{
    public class SharedTreeParameters : BaseParameters
    {
        public string Criterion { get; set; }

        public int MaxDepth { get; set; }

        public int MinSamplesSplit { get; set; }

        public int MaxLeafNodes { get; set; }

        public int MaxFeatures { get; set; }

        public int MinSamplesLeaf { get; set; }

        public double MinImpurityDecrease { get; set; }
    }
}
