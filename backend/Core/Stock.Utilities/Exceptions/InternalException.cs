using System;

namespace Stock.Utilities.Exceptions
{
    /// <summary>
    /// Exception used for internal (developer) errors.
    /// </summary>
    public class InternalException : Exception
    {
        public InternalErrorType ErrorType { get; }

        public InternalException(InternalErrorType type, string message) 
            : base(message)
        {
            ErrorType = type;
        }
    }

    public enum InternalErrorType
    {
        InvalidOperation,
        ForbiddenOperation,
        IncorrectBehavior
    }
}
