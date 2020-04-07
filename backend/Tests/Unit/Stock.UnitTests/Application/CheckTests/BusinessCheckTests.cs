using System;
using Stock.Application.Check;
using Stock.Application.Exceptions;
using Stock.Utilities.Helpers.Tests;
using Xunit;

namespace Stock.UnitTests.Application.CheckTests
{
    public class BusinessCheckTests : Test
    {
        [Fact]
        public void Check_Succeeds_No_Exception()
        {
            UnitTest(
                _ => ("item1", "item1", BusinessErrorType.InvalidRequest, "Items not equal."),
                p =>
                {
                    void Check() => Business.CheckEquality(p.Item1, p.Item2, p.InvalidRequest, p.Item4);
                    
                    return new Action(Check);
                },
                a => a.Invoke()
            );
        }

        [Fact]
        public void Check_Fails_With_Business_Exception()
        {
            UnitTest(
                _ => ("item1", "item2", BusinessErrorType.InvalidRequest, "Items not equal."),
                p =>
                {
                    void Check() => Business.CheckEquality(p.Item1, p.Item2, p.InvalidRequest, p.Item4);
                    
                    return new Action(Check);
                },
                a =>
                {
                    var exception = Assert.Throws<BusinessException>(a.Invoke);
                    Assert.Equal("Items not equal.", exception.Message);
                    Assert.Equal(BusinessErrorType.InvalidRequest, exception.ErrorType);
                }
            );
        }
    }
}
