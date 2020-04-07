using System.Linq;
using FuncSharp;

namespace Stock.Utilities.Extensions
{
    public static class Extensions
    {
        public static bool SafeEquals<T>(this T firstItem, T secondItem)
        {
            if (firstItem == null)
            {
                return secondItem == null;
            }
            
            return secondItem != null && firstItem.Equals(secondItem);
        }

        public static bool SafeNotEquals<T>(this T firstItem, T secondItem)
        {
            return !firstItem.SafeEquals(secondItem);
        }

        public static IOption<bool> ToTrueOption(this bool value)
        {
            return value.Match(t => Option.True, f => Option.Empty<bool>());
        }

        public static bool InEnum<T>(this string item) where T : struct
        {
            return CollectionExtensions.GetEnumDescriptionValues<T>().SafeAnyEquals(item);
        }

        public static bool InEnumExcept<T>(this string item, params T[] enums) where T : struct
        {
            return CollectionExtensions.GetEnumDescriptionValues<T>().Except(enums.Select(e => e.GetDescription())).SafeAnyEquals(item);
        }

        public static T GetEnum<T>(this string description) where T : struct
        {
            return CollectionExtensions.GetEnums<T>().FirstOrDefault(en => en.GetDescription() == description);
        }

        public static T GetEnum<T>(this string description, T explicitDefault) where T : struct
        {
            return CollectionExtensions.GetEnums<T>()
                .Where(en => en.GetDescription() == description).ToNonEmptyOption()
                .Map(en => en.First()).GetOrElse(explicitDefault);
        }
    }
}
