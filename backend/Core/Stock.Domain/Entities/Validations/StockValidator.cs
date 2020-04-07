using System;
using FluentValidation;
using Stock.Utilities.Extensions;

namespace Stock.Domain.Entities.Validations
{
    internal sealed class StockValidator : AbstractValidator<Stock>
    {
        internal StockValidator()
        {
            RuleFor(s => DateTime.Compare(s.CreatedAt, new DateTime(2000, 01, 01)) >= 0)
                .Must(b => b)
                .WithMessage("Stock price before year 2000 is not acceptable.");
            RuleFor(s => s.CompanySymbol.InEnum<CompanySymbol>())
                .Must(b => b)
                .WithMessage("Company with provided symbol is not supported.");
        }

        public new void Validate(Stock stock)
        {
            this.ValidateAndThrow(stock);
        }
    }
}
