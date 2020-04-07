using System.Collections.Generic;

namespace Stock.Domain.Entities.MlModelParameters.Rnn
{
    public class SharedRnnParameters : BaseParameters
    {
        public int SeqLen { get; set; }

        public int Epochs { get; set; }

        public int BatchSize { get; set; }

        public string Scaler { get; set; }

        public List<int> NetworkUnits { get; set; }

        public int NetworkLayers { get; set; }

        public double DropOut { get; set; }

        public bool BatchNormalization { get; set; }

        public List<string> Metrics { get; set; }

        public string Loss { get; set; }

        public string Optimizer { get; set; }
    }
}
