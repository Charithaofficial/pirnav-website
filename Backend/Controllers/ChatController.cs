using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Pirnav.API.Models;
using Pirnav.API.Services;
using System.Text.RegularExpressions;

namespace Pirnav.API.Controllers
{
    [ApiController]
    [EnableRateLimiting("chatLimiter")]
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
                return Ok(new
                {
                    success = false,
                    reply = "Please enter a message."
                });
            }

            var userMessage = request.Message.Trim();

            // ================= SESSION CHECK =================

            if (string.IsNullOrWhiteSpace(request.SessionId))
            {
                return Ok(new
                {
                    success = false,
                    reply = "Session expired. Please restart chat."
                });
            }

            // ================= MAX LENGTH =================

            if (userMessage.Length > 500)
            {
                return Ok(new
                {
                    success = false,
                    reply = "Message is too long."
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

            // ================= ALLOW COMMON GREETINGS =================

            var greetings = new[]
            {
                "hi",
                "hello",
                "hey",
                "hii",
                "helo"
            };

            if (greetings.Contains(userMessage.ToLower()))
            {
                var greetingResponse =
                    await _chatService.GetReply(
                        userMessage,
                        request.SessionId
                    );

                return Ok(greetingResponse);
            }

            // ================= MINIMUM LENGTH =================

            if (userMessage.Length < 3)
            {
                return Ok(new
                {
                    success = false,
                    reply = "Please enter a valid message."
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

            // ================= INVALID INPUTS =================

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

            // ================= TOO MANY NUMBERS =================

            int digitCount = userMessage.Count(char.IsDigit);

            if (digitCount > userMessage.Length / 2)
            {
                return Ok(new
                {
                    success = false,
                    reply = "Please enter meaningful text."
                });
            }

            // ================= BLOCK RANDOM STRINGS =================

            if (Regex.IsMatch(userMessage, @"^[a-zA-Z]{3,}$"))
            {
                var vowels = "aeiouAEIOU";

                int vowelCount =
                    userMessage.Count(c => vowels.Contains(c));

                if (vowelCount == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Please enter a proper message."
                    });
                }
            }

            // ================= EMAIL VALIDATION =================

            bool looksLikeEmail =
                userMessage.Contains("@") ||
                userMessage.Contains("gmail") ||
                userMessage.Contains("yahoo") ||
                userMessage.Contains("outlook");

            if (looksLikeEmail)
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

            var response =
                await _chatService.GetReply(
                    userMessage,
                    request.SessionId
                );

            // ================= SAFE RESPONSE =================

            if (response == null)
            {
                return Ok(new
                {
                    success = false,
                    reply = "Unable to process your request right now."
                });
            }

            if (string.IsNullOrWhiteSpace(response.Reply))
            {
                return Ok(new
                {
                    success = false,
                    reply = "Unable to process your request."
                });
            }

            return Ok(response);
        }
    }
}