using Stock.Utilities.Extensions;
using Stock.Utilities.Helpers.Tests;
using Xunit;

namespace Stock.UnitTests.Utilities.ExtensionsTests
{
    public class DescriptionTests : Test
    {
        [Fact]
        public void Enum_Field_Description_Equals_GetDescription_Result()
        {
            UnitTest(
                _ => TestEnum.Test1,
                p => p.GetDescription().SafeEquals("Test1"),
                Assert.True
            );
        }
    }
}
