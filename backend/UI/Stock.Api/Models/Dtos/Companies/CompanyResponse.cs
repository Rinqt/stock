using System;
using System.Collections.Generic;
using Stock.Application.Infrastructure.Components.Interfaces;

namespace Stock.Api.Models.Dtos.Companies
{
    public class CompanyResponse : IMappable

    {
        public Guid Id { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public string Symbol { get; private set; }

        public string Name { get; private set; }

        public string Ceo { get; private set; }

        public string Description { get; private set; }

        public List<string> Tags { get; private set; }

        public string Industry { get; private set; }

        public int? Employees { get; private set; }

        public string Website { get; private set; }

        public string City { get; private set; }

        public string Country { get; private set; }
    }
}
