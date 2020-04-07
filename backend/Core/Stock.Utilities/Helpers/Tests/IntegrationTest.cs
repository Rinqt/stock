using System.IO;
using Newtonsoft.Json;

namespace Stock.Utilities.Helpers.Tests
{
    public class IntegrationTest
    {
        public void CreateTestFile()
        {
            Directory.CreateDirectory("Localization/En");
            using var writer = new StreamWriter("Localization/En/Messages.json", false);
            const string testData =
                @"{
                  ""Test"": ""My name is Harun."",
                  ""Test1"": ""My name is {name}."",
                  ""Test2"": ""My name is {name} and I am {age} years old.""
                }";
            var obj = JsonConvert.DeserializeObject(testData);
            writer.Write(obj);
        }
    }
}
