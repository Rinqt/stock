using Stock.Domain.Entities;
using Stock.Utilities.Extensions;

namespace Stock.Domain.Extensions
{
    public static class EntityExtensions
    {
        public static bool Is(this Article first, Article second)
        {
            return first.CompanySymbol.SafeEquals(second.CompanySymbol) && first.CreatedAt.Date.SafeEquals(second.CreatedAt.Date) && first.Title.SafeEquals(second.Title);
        }

        public static bool Is(this Entities.Stock first, Entities.Stock second)
        {
            return first.CompanySymbol.SafeEquals(second.CompanySymbol) && first.CreatedAt.Date.SafeEquals(second.CreatedAt.Date);
        }
    }
}
