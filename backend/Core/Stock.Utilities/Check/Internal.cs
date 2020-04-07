using Stock.Utilities.Exceptions;
using Stock.Utilities.Extensions;

namespace Stock.Utilities.Check
{
    public static class Internal
    {
        /// <summary>
        /// Used for internal (developer) checks.
        /// </summary>
        /// <typeparam name="TValue"></typeparam>
        /// <param name="expected"></param>
        /// <param name="actual"></param>
        /// <param name="errorType"></param>
        /// <param name="message"></param>
        /// <exception cref="InternalException"></exception>
        public static void CheckEquality<TValue>(TValue expected, TValue actual, InternalErrorType errorType, string message)
        {
            if (actual.SafeNotEquals(expected))
            {
                throw new InternalException(errorType, message);
            }
        }

        /// <summary>
        /// Throws Internal exception if value is not true.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="errorType"></param>
        /// <param name="message"></param>
        public static void Check(bool value, InternalErrorType errorType, string message)
        {
            if (value.SafeNotEquals(true))
            {
                throw new InternalException(errorType, message);
            }
        }
    }
}
