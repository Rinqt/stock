using Stock.Application.Exceptions;
using Stock.Utilities.Extensions;

namespace Stock.Application.Check
{
    public static class Business
    {
        /// <summary>
        /// Used for business checks.
        /// </summary>
        /// <typeparam name="TValue"></typeparam>
        /// <param name="expected"></param>
        /// <param name="actual"></param>
        /// <param name="errorType"></param>
        /// <param name="message"></param>
        /// <exception cref="BusinessException"></exception>
        public static void CheckEquality<TValue>(TValue expected, TValue actual, BusinessErrorType errorType, string message)
        {
            if (actual.SafeNotEquals(expected))
            {
                throw new BusinessException(errorType, message);
            }
        }

        /// <summary>
        /// Throws Business exception if value is not true.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="errorType"></param>
        /// <param name="message"></param>
        public static void Check(bool value, BusinessErrorType errorType, string message)
        {
            if (value.SafeNotEquals(true))
            {
                throw new BusinessException(errorType, message);
            }
        }
    }
}
