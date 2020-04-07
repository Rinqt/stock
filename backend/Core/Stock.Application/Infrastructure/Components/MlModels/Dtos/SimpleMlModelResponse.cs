using System;

namespace Stock.Application.Infrastructure.Components.MlModels.Dtos
{
    public class SimpleMlModelResponse
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Name { get; set; }

        public string CompanySymbol { get; set; }

        public string Type { get; set; }

        public string State { get; set; }
    }
}
