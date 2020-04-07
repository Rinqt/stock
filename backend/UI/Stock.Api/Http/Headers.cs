using Stock.Utilities.Enumerations;

namespace Stock.Api.Http
{
    public class Headers
    {
        /// <summary>
        /// Used for authorization.
        /// </summary>
        public string AccessToken { get; }

        public Language Language { get; }

        public Headers(string accessToken, Language language)
        {
            AccessToken = accessToken;
            Language = language;
        }
    }
}
