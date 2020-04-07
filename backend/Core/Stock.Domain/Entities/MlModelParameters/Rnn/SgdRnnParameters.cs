namespace Stock.Domain.Entities.MlModelParameters.Rnn
{
    public class SgdRnnParameters : SharedRnnParameters
    {
        public double LearningRate { get; set; }

        public double Momentum { get; set; }

        public double Decay { get; set; }

        public bool Nesterov { get; set; }
    }
}
