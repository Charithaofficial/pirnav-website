using System.Collections.Generic;

namespace Pirnav.API.Models
{
    public class ChatRequest
    {
        public string Message { get; set; }
        public string SessionId { get; set; } 
    }

    public class ChatResponse
    {
        public string Reply { get; set; }
        public List<string> Suggestions { get; set; } 
        public string Step { get; set; } 
    }
}