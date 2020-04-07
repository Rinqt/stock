using System.Collections.Generic;

namespace Stock.Components.Companies.Dtos
{
    public class Company
    {
        public string Symbol { get; set; }

        public string CompanyName { get; set; }

        public string Exchange { get; set; }

        public string Industry { get; set; }

        public string Website { get; set; }

        public string Description { get; set; }

        public string CEO { get; set; }

        public string SecurityName { get; set; }

        public string IssueType { get; set; }

        public string Sector { get; set; }

        public int? PrimarySicCode { get; set; }

        public int? Employees { get; set; }

        public List<string> Tags { get; set; }

        public string Address { get; set; }

        public string Address2 { get; set; }

        public string State { get; set; }

        public string City { get; set; }

        public string Zip { get; set; }

        public string Country { get; set; }

        public string Phone { get; set; }
    }
}