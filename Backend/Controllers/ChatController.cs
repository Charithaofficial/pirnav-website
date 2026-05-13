using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Pirnav.API.Models;
using Pirnav.API.Services;
using System.Text.RegularExpressions;
using System.Linq;

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
        public async Task<IActionResult> SendMessage(
            [FromBody] ChatRequest request)
        {
            try
            {
                // ================= NULL CHECK =================

                if (request == null)
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Invalid request."
                    });
                }

                // ================= MESSAGE CHECK =================

                if (string.IsNullOrWhiteSpace(request.Message))
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Please enter a message."
                    });
                }

                // ================= SESSION CHECK =================

                if (string.IsNullOrWhiteSpace(request.SessionId))
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Session expired. Please restart chat."
                    });
                }

                // ================= CLEAN MESSAGE =================

                var userMessage = request.Message.Trim();

                userMessage = Regex.Replace(
                    userMessage,
                    @"\s+",
                    " ");

                // ================= MAX LENGTH =================

                if (userMessage.Length > 1000)
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Message is too long."
                    });
                }

                // ================= BLOCK EMPTY SYMBOLS =================

                if (!Regex.IsMatch(userMessage, @"[a-zA-Z0-9]"))
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Please enter meaningful text."
                    });
                }

                // ================= BLOCK SCRIPT ATTACKS =================

                if (Regex.IsMatch(
                    userMessage,
                    @"<script|</script|SELECT |DROP TABLE|INSERT INTO|DELETE FROM|UPDATE ",
                    RegexOptions.IgnoreCase))
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Invalid input detected."
                    });
                }

                // ================= MINIMUM LENGTH =================

                if (userMessage.Length < 2)
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Please enter a valid message."
                    });
                }

                // ================= BLOCK REPEATED CHARS =================

                if (Regex.IsMatch(
                    userMessage.ToLower(),
                    @"^(.)\1+$"))
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
                "aaa",
                "bbb",
                "ccc",
                "mmm",
                "nnn",
                "123",
                "111",
                "000"
            };

                if (invalidPatterns.Contains(
                    userMessage.ToLower()))
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Please enter meaningful text."
                    });
                }

                // ================= TOO MANY NUMBERS =================

                int digitCount =
                    userMessage.Count(char.IsDigit);

                if (digitCount > userMessage.Length / 2)
                {
                    return Ok(new
                    {
                        success = false,
                        reply = "Please enter meaningful text."
                    });
                }

                // ================= BLOCK RANDOM STRINGS =================

                if (Regex.IsMatch(
                    userMessage,
                    @"^[a-zA-Z]{4,}$"))
                {
                    var vowels = "aeiouAEIOU";

                    int vowelCount =
                        userMessage.Count(
                            c => vowels.Contains(c));

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
                    userMessage.Contains("@");

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

                // ================= CHAT SERVICE =================

                var response =
                    await _chatService.GetReply(
                        userMessage,
                        request.SessionId);

                // ================= RESPONSE SAFETY =================

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
            catch
            {
                return Ok(new
                {
                    success = false,
                    reply = "Something went wrong. Please try again later."
                });
            }
        }
    }


}
