using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FuncSharp;
using Newtonsoft.Json.Linq;
using Stock.Utilities.Enumerations;
using Stock.Utilities.Extensions;

namespace Stock.Utilities.Globalization
{
    internal static class Globalization
    {
        internal static async Task<string> GetMessage(string key, Language language, IReadOnlyCollection<string> arguments)
        {
            using var r = new StreamReader(
                language.Match(
                    Language.En, _ => "Localization/En/Messages.json",
                    Language.Cz, _ => "Localization/Cz/Messages.json"
                )
            );
            var messages = await r.ReadToEndAsync();
            var obj = JObject.Parse(messages);
            var message = obj[key].Value<string>();

            return arguments.Any().Match(
                t =>
                {
                    var parts = Regex.Split(message, @"{.*?}");
                    var list = new List<string>();
                    foreach (var part in parts.ToList().Select((value, index) => new { value, index }))
                    {
                        part.index.SafeEquals(0).Match(
                            y => list.Add(part.value),
                            n => list.Add($"{arguments.ElementAt(part.index - 1)}{part.value}")
                        );
                    }

                    return list.Aggregate((a, b) => $"{a}{b}");
                },
                f => message
            );
        }
    }
}
