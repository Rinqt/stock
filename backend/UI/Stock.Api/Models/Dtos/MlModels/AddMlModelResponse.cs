using System;
using Stock.Application.Infrastructure.Components.Interfaces;

namespace Stock.Api.Models.Dtos.MlModels
{
    public class AddMlModelResponse : IMappable
    {
        public Guid Id { get; set; }

        public string Message { get; set; }
    }
}
