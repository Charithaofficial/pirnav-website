using Microsoft.AspNetCore.Mvc;
using Pirnav.API.Models;
using Pirnav.API.Services;
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
                return BadRequest();
            }

            var response = await _chatService.GetReply(request.Message, request.SessionId);
            return Ok(response);
        }
    }
}