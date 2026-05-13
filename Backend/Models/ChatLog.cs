namespace Pirnav.API.Models
{
    public class ChatLog
    {
        public int Id { get; set; }

        public string? SessionId { get; set; }

        public string? UserMessage { get; set; }

        public string? BotReply { get; set; }

        public string? Step { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}