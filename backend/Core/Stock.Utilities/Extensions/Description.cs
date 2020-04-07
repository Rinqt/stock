using System;
using System.Linq;
using Stock.Utilities.Attributes;
using Stock.Utilities.Exceptions;

namespace Stock.Utilities.Extensions
{
    public static class Description
    {
        /// <summary>
        /// Should be used only for enum fields annotated with FieldDescription attribute.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        /// <exception cref="InternalException"></exception>
        public static string GetDescription<T>(this T t)
        {
            var type = t.GetType();
            
            if (type != null && type.IsEnum == false)
            {
                throw new InternalException(InternalErrorType.InvalidOperation, "FiledDescription can only be used for enum fields.");
            }
            
            var description = ((FieldDescriptionAttribute[])type.GetField(t.ToString())?.GetCustomAttributes(typeof(FieldDescriptionAttribute), false))?.Select(a => a?.Description).FirstOrDefault();
            
            return description ?? throw new ArgumentNullException(nameof(t), $"{typeof(T)} does not have description.");
        }
    }
}
