using Stock.Application.Exceptions;
using Stock.Utilities.Helpers.Tests;
using Xunit;

namespace Stock.UnitTests.Application.ExceptionsTests
{
    public class BusinessExceptionTests : Test
    {
        [Fact]
        public void Create_New_Business_Exception_For_Invalid_Request()
        {
            UnitTest(
                _ => (BusinessErrorType.InvalidRequest, "Custom message"),
                p => new BusinessException(p.InvalidRequest, p.Item2),
                e =>
                {
                    Assert.IsType<BusinessException>(e);
                    Assert.Contains("Custom message", e.Message);
                    Assert.IsType<BusinessErrorType>(e.ErrorType);
                    Assert.Equal(BusinessErrorType.InvalidRequest, e.ErrorType);
                }
            );
        }
    }
}
