using System.Collections.Generic;
using System.Linq;
using Stock.Utilities.Extensions;
using Stock.Utilities.Helpers.Tests;
using Xunit;

namespace Stock.UnitTests.Utilities.ExtensionsTests
{
    public class ExtensionsTests : Test
    {
        [Fact]
        public void Compare_Objects_Equality_Returns_True()
        {
            UnitTest(
                _ => new List<object>
                {
                    "item1", "item1"
                },
                p => p.ElementAt(0).SafeEquals(p.ElementAt(1)),
                Assert.True
            );
        }

        [Fact]
        public void Compare_Objects_Equality_Returns_False()
        {
            UnitTest(
                _ => new List<object>
                {
                    "item1", "item2"
                },
                p => p.ElementAt(0).SafeEquals(p.ElementAt(1)),
                Assert.False
            );
        }

        [Fact]
        public void Compare_Objects_Equality_When_First_Is_Null_Returns_False()
        {
            UnitTest(
                _ => new List<object>
                {
                    null, "item2"
                },
                p => p.ElementAt(0).SafeEquals(p.ElementAt(1)),
                Assert.False
            );
        }

        [Fact]
        public void Compare_Objects_Equality_When_Second_Is_Null_Returns_False()
        {
            UnitTest(
                _ => new List<object>
                {
                    "item1", null
                },
                p => p.ElementAt(0).SafeEquals(p.ElementAt(1)),
                Assert.False
            );
        }

        [Fact]
        public void Compare_Objects_Inequality_Returns_False()
        {
            UnitTest(
                _ => new List<object>
                {
                    "item1", "item1"
                },
                p => p.ElementAt(0).SafeNotEquals(p.ElementAt(1)),
                Assert.False
            );
        }

        [Fact]
        public void Compare_Objects_Inequality_Returns_True()
        {
            UnitTest(
                _ => new List<object>
                {
                    "item1", "item2"
                },
                p => p.ElementAt(0).SafeNotEquals(p.ElementAt(1)),
                Assert.True
            );
        }

        [Fact]
        public void Compare_Objects_Inequality_When_First_Is_Null_Returns_True()
        {
            UnitTest(
                _ => new List<object>
                {
                    null, "item2"
                },
                p => p.ElementAt(0).SafeNotEquals(p.ElementAt(1)),
                Assert.True
            );
        }

        [Fact]
        public void Compare_Objects_Inequality_When_Second_Is_Null_Returns_True()
        {
            UnitTest(
                _ => new List<object>
                {
                    "item1", null
                },
                p => p.ElementAt(0).SafeNotEquals(p.ElementAt(1)),
                Assert.True
            );
        }

        [Fact]
        public void Get_Enum_By_Description_Found()
        {
            UnitTest(
                _ => "Test1".GetEnum<TestEnum>(),
                p => p == TestEnum.Test1,
                Assert.True
            );
        }

        [Fact]
        public void Get_Enum_By_Description_Not_Found()
        {
            UnitTest(
                _ => "Test4".GetEnum<TestEnum>(),
                p => p == TestEnum.Test1,
                Assert.True
            );
        }

        [Fact]
        public void Get_Enum_By_Description_With_Default_Found()
        {
            UnitTest(
                _ => "Test1".GetEnum(TestEnum.Test2),
                p => p == TestEnum.Test1,
                Assert.True
            );
        }

        [Fact]
        public void Get_Enum_By_Description_With_Default_Not_Found()
        {
            UnitTest(
                _ => "Test4".GetEnum(TestEnum.Test2),
                p => p == TestEnum.Test2,
                Assert.True
            );
        }

        [Fact]
        public void In_Enum_True()
        {
            UnitTest(
                _ => "Test1",
                p => p.InEnum<TestEnum>(),
                Assert.True
            );
        }

        [Fact]
        public void In_Enum_False()
        {
            UnitTest(
                _ => "Test4",
                p => p.InEnum<TestEnum>(),
                Assert.False
            );
        }

        [Fact]
        public void In_Enum_Except_True()
        {
            UnitTest(
                _ => "Test1",
                p => p.InEnumExcept(TestEnum.Test2),
                Assert.True
            );
        }

        [Fact]
        public void In_Enum_Except_False()
        {
            UnitTest(
                _ => "Test3",
                p => p.InEnumExcept(TestEnum.Test3),
                Assert.False
            );
        }
    }
}
