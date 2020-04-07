namespace Stock.Domain.Entities.MlModelParameters.Rnn
{
    public class AdadeltaRnnParameters : SharedRnnParameters
    {
        public double LearningRate { get; set; }

        public double Rho { get; set; }

        public double Epsilon { get; set; }

        public double Decay { get; set; }
    }
}
