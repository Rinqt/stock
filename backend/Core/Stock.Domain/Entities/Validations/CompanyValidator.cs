using System;
using FluentValidation;
using Stock.Utilities.Extensions;

namespace Stock.Domain.Entities.Validations
{
    internal sealed class CompanyValidator : AbstractValidator<Company>
    {
        internal CompanyValidator()
        {
            RuleFor(c => c.Name).NotEmpty();
            RuleFor(c => c.Symbol.InEnum<CompanySymbol>())
                .Must(b => b)
                .WithMessage("Company with provided symbol is not supported.");
            RuleFor(c => c.Website)
                .Must(w => w.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || w.StartsWith("https://", StringComparison.OrdinalIgnoreCase) || w.StartsWith("ftp://", StringComparison.OrdinalIgnoreCase))
                .WithMessage("Website url format is not valid.");
        }

        public new void Validate(Company company)
        {
            this.ValidateAndThrow(company);
        }
    }
}
