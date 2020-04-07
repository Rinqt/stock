using System;

namespace Stock.Application.Infrastructure.Components.MlModels.Dtos
{
    public class AddMlModelResponse
    {
        public Guid Id { get; set; }

        public TimeSpan Delay { get; set; }
    }
}
