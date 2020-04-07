using System;

namespace Stock.Application.Exceptions
{
    /// <summary>
    /// Exception used for custom application errors.
    /// </summary>
    public class BusinessException : Exception
    {
        public BusinessErrorType ErrorType { get; }

        public BusinessException(BusinessErrorType type, string message) 
            : base(message)
        {
            ErrorType = type;
        }
    }

    public enum BusinessErrorType
    {
        InvalidRequest,
        ItemExists,
        ItemNotExists,
        UnsuccessfulOperation,
        Failure
    }
}
