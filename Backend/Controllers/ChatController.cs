using Microsoft.AspNetCore.Mvc;
using Pirnav.API.Models;
using Pirnav.API.Services;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
 
namespace Pirnav.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;
 
        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }
 
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Message))
            {
                return Ok(new
                {
                    success = false,
                    reply = "Message cannot be empty."
                });
            }
 
            var userMessage = request.Message.Trim();
 
            
            if (userMessage.Length < 3)
            {
                return Ok(new
                {
                    success = false,
                    reply = "Please enter a valid message (minimum 3 characters)."
                });
            }
 
           
            if (!Regex.IsMatch(userMessage, @"[a-zA-Z0-9]"))
            {
                return Ok(new
                {
                    success = false,
                    reply = "Please enter meaningful text."
                });
            }
 
            var response = await _chatService.GetReply(userMessage, request.SessionId);
 
            return Ok(response);
        }
    }
}