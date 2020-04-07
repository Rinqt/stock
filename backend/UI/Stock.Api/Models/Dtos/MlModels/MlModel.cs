using System;
using Stock.Application.Infrastructure.Components.Interfaces;
using Stock.Domain.Entities.MlModelParameters.Interfaces;

namespace Stock.Api.Models.Dtos.MlModels
{
    public class MlModel : IMappable
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Type { get; set; }

        public string Name { get; set; }

        public string CompanySymbol { get; set; }

        public IMlModelParameters Parameters { get; set; }

        public string State { get; set; }

        public object Result { get; set; }
    }
}
