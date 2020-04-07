using System;
using System.Net.Http;
using System.Threading.Tasks;
using FuncSharp;
using Stock.Utilities.Attributes;

namespace Stock.Components.Static
{
    internal static class Http
    {
        internal static async Task<HttpResponseMessage> GetAsync(Uri uri, Optimization optimization)
        {
            return await optimization.Match(
                Optimization.Performance, async _ => await Client.GetAsync(uri), 
                Optimization.Memory, async _ =>
                {
                    using var client = GetClient();
                    return await client.GetAsync(uri);
                }
            );
        }

        internal static async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, Optimization optimization)
        {
            return await optimization.Match(
                Optimization.Performance, async _ => await Client.SendAsync(request),
                Optimization.Memory, async _ =>
                {
                    using var client = GetClient();
                    return await client.SendAsync(request);
                }
            );
        }

        private static readonly HttpClient Client = new HttpClient{ Timeout = new TimeSpan(0, 60, 0) };

        private static HttpClient GetClient()
        {
            return new HttpClient { Timeout = new TimeSpan(0, 60, 0) };
        }
    }

    public enum Optimization
    {
        [FieldDescription("Performance")]
        Performance,

        [FieldDescription("Memory")]
        Memory
    }
}
