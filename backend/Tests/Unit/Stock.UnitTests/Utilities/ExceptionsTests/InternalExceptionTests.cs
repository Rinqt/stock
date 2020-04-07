using Stock.Utilities.Exceptions;
using Stock.Utilities.Helpers.Tests;
using Xunit;

namespace Stock.UnitTests.Utilities.ExceptionsTests
{
    public class InternalExceptionTests : Test
    {
        [Fact]
        public void Create_New_Internal_Exception_For_Forbidden_Operation()
        {
            UnitTest(
                _ => (InternalErrorType.ForbiddenOperation, "Custom message"),
                p => new InternalException(p.ForbiddenOperation, p.Item2), 
                e =>
                {
                    Assert.IsType<InternalException>(e);
                    Assert.Contains("Custom message", e.Message);
                    Assert.IsType<InternalErrorType>(e.ErrorType);
                    Assert.Equal(InternalErrorType.ForbiddenOperation, e.ErrorType);
                }
            );
        }
    }
}
