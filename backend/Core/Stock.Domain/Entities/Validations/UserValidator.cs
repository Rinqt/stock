using FluentValidation;
using Stock.Utilities.Enumerations;
using Stock.Utilities.Extensions;

namespace Stock.Domain.Entities.Validations
{
    internal sealed class UserValidator : AbstractValidator<User>
    {
        internal UserValidator()
        {
            RuleFor(u => u.Username)
                .MaximumLength(15).MinimumLength(5).WithMessage("Username must be at least 5 and at most 15 characters long.");
            RuleFor(u => u.Language.InEnum<Language>())
                .Must(b => b).WithMessage("Specified language not supported.");
            RuleForEach(u => u.FavoriteCompanies)
                .Must(co => co.Symbol.InEnum<CompanySymbol>())
                .WithMessage("Some of specified companies are not supported.");
            RuleForEach(u => u.SearchedCompanies)
                .Must(co => co.Symbol.InEnum<CompanySymbol>())
                .WithMessage("Some of specified companies are not supported.")
                .Must(co => co.SearchedAt.SafeNotEquals(default))
                .WithMessage("Date of search is not valid.");
        }

        public new void Validate(User user)
        {
            this.ValidateAndThrow(user);
        }
    }
}
