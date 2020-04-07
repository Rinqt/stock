using System;
using System.Collections.Generic;
using System.Linq;
using FuncSharp;

namespace Stock.Utilities.Extensions
{
    public static class CollectionExtensions
    {
        public static bool AllInEnum<T>(this IEnumerable<string> items) where T : struct
        {
            var collection = GetEnumDescriptionValues<T>();
            return items.ToNonEmptyOption().GetOrElse(Enumerable.Empty<string>()).All(i => collection.Any(j => j == i));
        }

        public static IEnumerable<string> GetEnumDescriptionValues<T>() where T : struct
        {
            return GetEnums<T>().Select(en => en.GetDescription());
        }

        /// <summary>
        /// Flattens the collection and removes nulls.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <returns></returns>
        public static IEnumerable<T> Flatten<T>(this IEnumerable<IEnumerable<T>> source) where T : class
        {
            return source.ToNonEmptyOption().GetOrElse(Enumerable.Empty<IEnumerable<T>>()).SelectMany(i => i.Where(j => j.SafeNotEquals(null)));
        }

        /// <summary>
        /// Avoid working with collection of objects. Preferably use specific type.
        /// e.g. default value for boolean is false but if it is in a collection of objects it will be handled as null.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="type"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        public static bool SafeAnyEquals<T>(this T type, IEnumerable<T> collection)
        {
            return collection.ToNonEmptyOption().GetOrElse(Enumerable.Empty<T>()).Any(i => i.SafeEquals(type));
        }

        /// <summary>
        /// Avoid working with collection of objects. Preferably use specific type.
        /// e.g. default value for boolean is false but if it is in a collection of objects it will be handled as null.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="collection"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool SafeAnyEquals<T>(this IEnumerable<T> collection, T type)
        {
            return collection.ToNonEmptyOption().GetOrElse(Enumerable.Empty<T>()).Any(i => i.SafeEquals(type));
        }

        /// <summary>
        /// Avoid working with collection of objects. Preferably use specific type.
        /// e.g. default value for boolean is false but if it is in a collection of objects it will be handled as null.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="type"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        public static bool SafeAnyEquals<T>(this T type, params T[] collection)
        {
            return collection.ToNonEmptyOption().GetOrElse(Enumerable.Empty<T>()).Any(i => i.SafeEquals(type));
        }

        public static IEnumerable<T> GetEnums<T>() where T : struct
        {
            return Enum.GetValues(typeof(T)).Cast<T>();
        }
    }
}
