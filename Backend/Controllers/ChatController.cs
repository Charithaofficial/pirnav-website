using Microsoft.AspNetCore.Mvc;
using Pirnav.API.Models;
using Pirnav.API.Services;
using System.Text.RegularExpressions;

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
            // ================= NULL / EMPTY CHECK =================

            if (request == null || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new
                {
                    success = false,
                    reply = "Message cannot be empty."
                });
            }

            var userMessage = request.Message.Trim();

            // ================= MINIMUM LENGTH =================

            if (userMessage.Length < 3)
            {
                return Ok(new
                {
                    success = false,
                    reply = "Please enter a valid message."
                });
            }

            // ================= BLOCK ONLY SYMBOLS =================

            if (!Regex.IsMatch(userMessage, @"[a-zA-Z0-9]"))
            {
                return Ok(new
                {
                    success = false,
                    reply = "Please enter meaningful text."
                });
            }

            // ================= BLOCK REPEATED CHARACTERS =================

            if (Regex.IsMatch(userMessage.ToLower(), @"^(.)\1+$"))
            {
                return Ok(new
                {
                    success = false,
                    reply = "Please enter meaningful text."
                });
            }

            // ================= BLOCK RANDOM KEYBOARD INPUTS =================

            var invalidPatterns = new[]
            {
                "abc",
                "abcd",
                "asdf",
                "asdfgh",
                "qwerty",
                "zxcv",
                "test",
                "testing",
                "aaa",
                "bbb",
                "ccc",
                "mmm",
                "nnn",
                "pr",
                "ok",
                "hi",
                "hello1",
                "mmnnjj",
                "123",
                "111",
                "000"
            };

            if (invalidPatterns.Contains(userMessage.ToLower()))
            {
                return Ok(new
                {
                    success = false,
                    reply = "Please enter meaningful text."
                });
            }

            // ================= BLOCK TOO MANY NUMBERS =================

            int digitCount = userMessage.Count(char.IsDigit);

            if (digitCount > userMessage.Length / 2)
            {
                return Ok(new
                {
                    success = false,
                    reply = "Please enter meaningful text."
                });
            }

            // ================= BLOCK RANDOM MIXED STRINGS =================

            if (Regex.IsMatch(userMessage, @"^[a-zA-Z]{3,}$"))
            {
                var vowels = "aeiouAEIOU";
                int vowelCount = userMessage.Count(c => vowels.Contains(c));

                // Example: mmnnjj, xzrtpl
                if (vowelCount == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Please enter a proper message."
                    });
                }
            }

            // ================= MAX LENGTH PROTECTION =================

            if (userMessage.Length > 500)
            {
                return Ok(new
                {
                    success = false,
                    reply = "Message is too long."
                });
            }



            // ================= EMAIL VALIDATION =================

            if (
                userMessage.Contains("@") ||
                userMessage.Contains("gmail") ||
                userMessage.Contains("yahoo") ||
                userMessage.Contains("outlook")
            )
            {
                bool isValidEmail = Regex.IsMatch(
                    userMessage,
                    @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                );

                if (!isValidEmail)
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Please enter a valid email address."
                    });
                }
            }

          

            // ================= CALL CHAT SERVICE =================


            var response = await _chatService.GetReply(userMessage, request.SessionId);

            // ================= SAFE RESPONSE =================

            if (response == null)
            {
                return Ok(new
                {
                    success = false,
                    reply = "Unable to process your request right now."
                });
            }

            return Ok(response);
        }



    }
}