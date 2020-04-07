namespace Stock.Domain.Entities.MlModelParameters.DTrees
{
    public class RandomForestParameters : SharedTreeParameters
    {
        public bool Bootstrap { get; set; }

        public int NEstimators { get; set; }

        public bool OobScore { get; set; }

        public bool WarmStart { get; set; }
    }
}
