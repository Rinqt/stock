using FluentValidation;
using Stock.Utilities.Extensions;

namespace Stock.Domain.Entities.Validations
{
    internal sealed class ArticleValidator : AbstractValidator<Article>
    {
        internal ArticleValidator()
        {
            RuleFor(a => a.Source).NotEmpty();
            RuleFor(a => a.Content).NotEmpty();
            RuleFor(a => a.Title).NotEmpty();
            RuleFor(a => a.CreatedAt).NotEmpty();
            RuleFor(a => a.CompanySymbol.InEnum<CompanySymbol>())
                .Must(b => b)
                .WithMessage("Company with provided symbol is not supported.");
            RuleFor(a => a.Polarity.InEnum<Polarity>())
                .Must(b => b)
                .WithMessage("Specified type of polarity is not supported.");
            RuleFor(a => a.Image)
                .Must(l => l.Contains("https://"))
                .WithMessage("Image link is not valid.");
        }

        public new void Validate(Article article)
        {
            this.ValidateAndThrow(article);
        }
    }
}
