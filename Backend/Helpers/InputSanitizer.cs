using System.Text.RegularExpressions;

namespace Pirnav.API.Helpers
{
    public static class InputSanitizer
    {
        public static string Clean(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            // remove html tags
            input = Regex.Replace(input, "<.*?>", string.Empty);

            // trim spaces
            return input.Trim();
        }
    }
}