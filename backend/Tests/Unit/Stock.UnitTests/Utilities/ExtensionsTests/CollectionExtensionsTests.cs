using System.Collections.Generic;
using System.Linq;
using Stock.Utilities.Extensions;
using Stock.Utilities.Helpers.Tests;
using Xunit;

namespace Stock.UnitTests.Utilities.ExtensionsTests
{
    public class CollectionExtensionsTests : Test
    {
        [Fact]
        public void All_Enum_Filed_Descriptions()
        {
            UnitTest(
                _ => Stock.Utilities.Extensions.CollectionExtensions.GetEnumDescriptionValues<TestEnum>().ToList(),
                p => p.Contains("Test1") && p.Contains("Test2") && p.Contains("Test3"),
                Assert.True
            );
        }

        [Fact]
        public void Not_All_Enum_Filed_Descriptions()
        {
            UnitTest(
                _ => Stock.Utilities.Extensions.CollectionExtensions.GetEnumDescriptionValues<TestEnum>().ToList(),
                p => p.Contains("Test1") && p.Contains("Test2") && p.Contains("Test3") && p.Contains("Test4"),
                Assert.False
            );
        }

        [Fact]
        public void All_In_Enum_True()
        {
            UnitTest(
                _ => new List<string> {"Test1", "Test2", "Test3" },
                p => p.AllInEnum<TestEnum>(),
                Assert.True
            );
        }

        [Fact]
        public void All_In_Enum_False()
        {
            UnitTest(
                _ => new List<string> { "Test1", "Test2", "Test3", "Test4" },
                p => p.AllInEnum<TestEnum>(),
                Assert.False
            );
        }

        [Fact]
        public void Get_List_From_List_Of_Lists()
        {
            UnitTest(
                _ => new List<List<string>>{new List<string>{"Item1", "Item1", null, null}, new List<string>{ "Item1", "Item1", null} },
                p => p.Flatten().ToList(),
                r => Assert.Equal(new List<string>{ "Item1", "Item1", "Item1", "Item1"}, r)
            );
        }

        [Fact]
        public void Item_In_Collection_True()
        {
            UnitTest(
                _ => new List<int> { 1, 0, 0, 3 },
                p => 1.SafeAnyEquals(p),
                Assert.True
            );
        }

        [Fact]
        public void Item_In_Collection_False()
        {
            UnitTest(
                _ => new List<int> { 1, 0, 0, 3 },
                p => 5.SafeAnyEquals(p),
                Assert.False
            );
        }

        [Fact]
        public void Item_In_Params_Collection_True()
        {
            UnitTest(
                _ => 1,
                p => 1.SafeAnyEquals(1, 2, 3, 4, 1),
                Assert.True
            );
        }

        [Fact]
        public void Item_In_Params_Collection_False()
        {
            UnitTest(
                _ => 5,
                p => 5.SafeAnyEquals(1, 2, 3, 6),
                Assert.False
            );
        }

        [Fact]
        public void Collection_With_Item_True()
        {
            UnitTest(
                _ => new List<int> { 1, 0, 0, 3 },
                p => p.SafeAnyEquals(1),
                Assert.True
            );
        }

        [Fact]
        public void Collection_With_Item_False()
        {
            UnitTest(
                _ => new List<int> { 1, 0, 0, 3 },
                p => p.SafeAnyEquals(5),
                Assert.False
            );
        }
    }
}
