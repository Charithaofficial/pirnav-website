namespace Pirnav.API.Helpers
{
    public static class EmailHelper
    {
        public static bool IsBlockedDomain(string email)
        {
            var blockedDomains = new List<string>
            {
                "mailinator.com",
                "tempmail.com",
                "yopmail.com",
                "guerrillamail.com",
                "10minutemail.com"
            };

            var domain = email.Split('@').Last().ToLower();

            return blockedDomains.Contains(domain);
        }

        public static bool IsSpamContent(string text)
        {
            if (string.IsNullOrEmpty(text))
                return false;

            var spamKeywords = new List<string>
    {
        "seo",
        "crypto",
        "loan",
        "casino",
        "investment",
        "marketing",
        "promotion",
        "backlinks"
    };

            text = text.ToLower();

            return spamKeywords.Any(keyword => text.Contains(keyword));
        }
    }


}