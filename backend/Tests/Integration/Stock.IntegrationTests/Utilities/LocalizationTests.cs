using Stock.Utilities.Enumerations;
using Stock.Utilities.Globalization;
using Stock.Utilities.Helpers.Tests;
using Xunit;

namespace Stock.IntegrationTests.Utilities
{
    public class LocalizationTests : Test, IClassFixture<IntegrationTest>
    {
        public LocalizationTests(IntegrationTest test)
        {
            test.CreateTestFile();
        }

        [Fact]
        public void Get_Localized_Message_In_En()
        {
            IntegrationTest(
                _ => "Test",
                p => Localization.Get(p),
                m => Assert.Equal("My name is Harun.", m)
            );
        }

        [Fact]
        public void Get_Localized_Message_In_En_One_Dynamic_Param()
        {
            IntegrationTest(
                _ => "Harun",
                p => Localization.Get("Test1", Language.En, p),
                m => Assert.Equal("My name is Harun.", m)
            );
        }

        [Fact]
        public void Get_Localized_Message_In_En_Two_Dynamic_Params()
        {
            IntegrationTest(
                _ => ("Harun", "24"),
                p => Localization.Get("Test2", Language.En, p.Item1, p.Item2),
                m => Assert.Equal("My name is Harun and I am 24 years old.", m)
            );
        }
    }
}
