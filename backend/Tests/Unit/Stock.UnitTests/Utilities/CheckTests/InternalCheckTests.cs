using System;
using Stock.Utilities.Check;
using Stock.Utilities.Exceptions;
using Stock.Utilities.Helpers.Tests;
using Xunit;

namespace Stock.UnitTests.Utilities.CheckTests
{
    public class InternalCheckTests : Test
    {
        [Fact]
        public void Check_Succeeds_No_Exception()
        {
            UnitTest(
                _ => ("item1", "item1", InternalErrorType.InvalidOperation, "Items not equal."),
                p =>
                {
                    void Check() => Internal.CheckEquality(p.Item1, p.Item2, p.InvalidOperation, p.Item4);
                    
                    return new Action(Check);
                },
                a => a.Invoke()
            );
        }

        [Fact]
        public void Check_Fails_With_Internal_Exception()
        {
            UnitTest(
                _ => ("item1", "item2", InternalErrorType.InvalidOperation, "Items not equal."),
                p =>
                {
                    void Check() => Internal.CheckEquality(p.Item1, p.Item2, p.InvalidOperation, p.Item4);
                    
                    return new Action(Check);
                },
                a =>
                {
                    var exception = Assert.Throws<InternalException>(a.Invoke);
                    Assert.Equal("Items not equal.", exception.Message);
                    Assert.Equal(InternalErrorType.InvalidOperation, exception.ErrorType);
                }
            );
        }
    }
}
