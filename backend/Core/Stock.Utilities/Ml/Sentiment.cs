using VaderSharp;

namespace Stock.Utilities.Ml
{
    public static class Sentiment
    {
        public static SentimentAnalysisResults Analyze(this string text)
        {
            var analyzer = new SentimentIntensityAnalyzer();
            return analyzer.PolarityScores(text);
        }

        public static string GetPolarity(this SentimentAnalysisResults results)
        {
            var result = results.Compound;
            if (result < 0)
            {
                return "Negative";
            }
            return result <= 0.5 ? "Neutral" : "Positive";
        }
    }
}
