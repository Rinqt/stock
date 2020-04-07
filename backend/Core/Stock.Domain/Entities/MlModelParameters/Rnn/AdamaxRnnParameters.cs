namespace Stock.Domain.Entities.MlModelParameters.Rnn
{
    public class AdamaxRnnParameters : SharedRnnParameters
    {
        public double LearningRate { get; set; }

        public double Beta1 { get; set; }

        public double Beta2 { get; set; }

        public double Epsilon { get; set; }

        public double Decay { get; set; }
    }
}
