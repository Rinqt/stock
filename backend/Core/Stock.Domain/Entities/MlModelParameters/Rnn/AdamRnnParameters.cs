namespace Stock.Domain.Entities.MlModelParameters.Rnn
{
    public class AdamRnnParameters : AdamaxRnnParameters
    {
        public bool Amsgrad { get; set; }
    }
}
