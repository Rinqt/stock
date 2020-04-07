using System.Linq;
using System.Threading.Tasks;
using Stock.Utilities.Enumerations;

namespace Stock.Utilities.Globalization
{
    public static class Localization
    {
        /// <summary>
        /// Language is selected explicitly.
        /// </summary>
        /// <param name="key"></param>
        /// <param name="language"></param>
        /// <param name="arguments"></param>
        /// <returns></returns>
        public static async Task<string> GetAsync(string key, Language language, params string[] arguments)
        {
            return await Globalization.GetMessage(key, language, arguments.ToList());
        }

        /// <summary>
        /// English is chosen implicitly.
        /// </summary>
        /// <param name="key"></param>
        /// <param name="arguments"></param>
        /// <returns></returns>
        public static async Task<string> GetAsync(string key, params string[] arguments)
        {
            return await Globalization.GetMessage(key, Language.En, arguments.ToList());
        }

        /// <summary>
        /// Language is selected explicitly.
        /// </summary>
        /// <param name="key"></param>
        /// <param name="language"></param>
        /// <param name="arguments"></param>
        /// <returns></returns>
        public static string Get(string key, Language language, params string[] arguments)
        {
            return Globalization.GetMessage(key, language, arguments.ToList()).GetAwaiter().GetResult();
        }

        /// <summary>
        /// English is chosen implicitly.
        /// </summary>
        /// <param name="key"></param>
        /// <param name="arguments"></param>
        /// <returns></returns>
        public static string Get(string key, params string[] arguments)
        {
            return Globalization.GetMessage(key, Language.En, arguments.ToList()).GetAwaiter().GetResult();
        }
    }
}
