using Microsoft.Extensions.Configuration;
using Pirnav.API.Models;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Linq;
using System.Net;

namespace Pirnav.API.Services
{
    public class ChatService
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
    public ChatService(
        AppDbContext context,
        EmailService emailService,
        IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        // ================= SESSION STORAGE =================

        private static readonly Dictionary<string, string> UserSteps = new();

        private static readonly Dictionary<string, Lead> UserData = new();

        private static readonly Dictionary<string, DateTime> SessionActivity = new();

        // ================= FAQ RESPONSES =================

        private static readonly Dictionary<string, string> FaqResponses = new()
    {
        {
            "services",
            "We provide Web Development, Mobile App Development, UI/UX Design, Staffing Solutions, Cloud Solutions, AI Services, and Enterprise Software Development."
        },
        {
            "company",
            "Pirnav Software Solutions Pvt Ltd delivers innovative software and staffing solutions for global businesses."
        },
        {
            "location",
            "Pirnav operates across India, USA, UK, and Canada."
        },
        {
            "careers",
            "You can explore opportunities through our Careers page or connect with our HR team."
        },
        {
            "contact",
            "You can reach our team anytime at hr@pirnav.com"
        },
        {
            "technologies",
            "We work with .NET, React, Angular, Node.js, Flutter, Azure, AWS, SQL, AI/ML, and enterprise cloud technologies."
        }
    };

        // ================= MAIN METHOD =================

        public async Task<ChatResponse> GetReply(
            string message,
            string sessionId)
        {
            // ================= SESSION VALIDATION =================

            if (string.IsNullOrWhiteSpace(sessionId))
            {
                return await BuildResponse(
                    "system",
                    "system",
                    "Session expired. Please restart the chat.",
                    "done");
            }

            // ================= MESSAGE VALIDATION =================

            if (string.IsNullOrWhiteSpace(message))
            {
                return await BuildResponse(
                    sessionId,
                    "empty",
                    "Please enter a valid message.",
                    "done");
            }

            message = message.Trim();

            // ================= SECURITY =================

            //message = WebUtility.HtmlEncode(message);

            // ================= ANTI-SQL/XSS =================

            if (Regex.IsMatch(
                message,
                @"(<script>|</script>|SELECT |DROP TABLE|INSERT INTO|DELETE FROM|UPDATE )",
                RegexOptions.IgnoreCase))
            {
                return await BuildResponse(
                    sessionId,
                    message,
                    "Invalid input detected.",
                    "done");
            }

            // ================= SESSION INIT =================

            if (!UserSteps.ContainsKey(sessionId))
                UserSteps[sessionId] = "start";

            if (!UserData.ContainsKey(sessionId))
                UserData[sessionId] = new Lead();

            SessionActivity[sessionId] = DateTime.UtcNow;

            // ================= CLEAN OLD SESSIONS =================

            var expiredSessions = SessionActivity
                .Where(x => x.Value < DateTime.UtcNow.AddMinutes(-30))
                .Select(x => x.Key)
                .ToList();

            foreach (var expiredSession in expiredSessions)
            {
                UserSteps.Remove(expiredSession);
                UserData.Remove(expiredSession);
                SessionActivity.Remove(expiredSession);
            }

            var step = UserSteps[sessionId];

            var lowerMessage = message.ToLower();

            // ================= RESTART =================

            if (lowerMessage == "restart" ||
                lowerMessage == "start again")
            {
                UserSteps[sessionId] = "start";

                UserData[sessionId] = new Lead();

                return await BuildResponse(
                    sessionId,
                    message,
                    "Chat restarted successfully 😊",
                    "route",
                    new List<string>
                    {
                    "Development",
                    "Staffing",
                    "Support"
                    });
            }

            // ================= BACK =================

            if (lowerMessage == "back")
            {
                UserSteps[sessionId] = "route";

                return await BuildResponse(
                    sessionId,
                    message,
                    "Please choose an option again.",
                    "route",
                    new List<string>
                    {
                    "Development",
                    "Staffing",
                    "Support"
                    });
            }

            // ================= FAQ =================

            foreach (var faq in FaqResponses)
            {
                if (lowerMessage.Contains(faq.Key))
                {
                    return await BuildResponse(
                        sessionId,
                        message,
                        faq.Value,
                        "route",
                        new List<string>
                        {
                        "Development",
                        "Staffing",
                        "Support"
                        });
                }
            }

            // ================= FLOW =================

            switch (step)
            {
                case "start":

                    UserSteps[sessionId] = "route";

                    return await BuildResponse(
                        sessionId,
                        message,
                        "Hi 👋 Welcome to Pirnav! Please choose an option:",
                        "route",
                        new List<string>
                        {
                        "Development",
                        "Staffing",
                        "Support"
                        });

                case "route":

                    if (lowerMessage == "hi" ||
                        lowerMessage == "hello" ||
                        lowerMessage == "hey")
                    {
                        return await BuildResponse(
                            sessionId,
                            message,
                            "Hello 👋 How can we assist you today?",
                            "route",
                            new List<string>
                            {
                            "Development",
                            "Staffing",
                            "Support"
                            });
                    }

                    // DEVELOPMENT

                    if (lowerMessage.Contains("development"))
                    {
                        UserData[sessionId].Requirement = "Development";

                        UserSteps[sessionId] = "development_type";

                        return await BuildResponse(
                            sessionId,
                            message,
                            "Excellent 👍 What type of development service are you looking for?",
                            "development_type",
                            new List<string>
                            {
                            "Web Development",
                            "Mobile App",
                            "UI/UX Design",
                            "Custom Software",
                            "AI Solutions"
                            });
                    }

                    // STAFFING

                    if (lowerMessage.Contains("staffing"))
                    {
                        UserData[sessionId].Requirement = "Staffing";

                        UserSteps[sessionId] = "staffing_requirement";

                        return await BuildResponse(
                            sessionId,
                            message,
                            "Great 👍 Please share your staffing requirement.",
                            "staffing_requirement");
                    }

                    // SUPPORT

                    if (lowerMessage.Contains("support"))
                    {
                        return await BuildResponse(
                            sessionId,
                            message,
                            "Our support team will contact you shortly.\n\nYou can also reach us at hr@pirnav.com",
                            "done");
                    }

                    return await BuildResponse(
                        sessionId,
                        message,
                        "Please choose a valid option.",
                        "route",
                        new List<string>
                        {
                        "Development",
                        "Staffing",
                        "Support"
                        });

                case "development_type":

                    UserData[sessionId].Requirement +=
                        $"\nService Type: {message}";

                    UserSteps[sessionId] = "development_platform";

                    return await BuildResponse(
                        sessionId,
                        message,
                        "Perfect 🚀 Which platform do you need?",
                        "development_platform",
                        new List<string>
                        {
                        "Web",
                        "Android",
                        "iOS",
                        "Both"
                        });

                case "development_platform":

                    UserData[sessionId].Requirement +=
                        $"\nPlatform: {message}";

                    UserSteps[sessionId] = "development_timeline";

                    return await BuildResponse(
                        sessionId,
                        message,
                        "Great 👍 What is your expected project timeline?",
                        "development_timeline",
                        new List<string>
                        {
                        "ASAP",
                        "1 Month",
                        "3 Months",
                        "6+ Months"
                        });

                case "development_timeline":

                    UserData[sessionId].Requirement +=
                        $"\nTimeline: {message}";

                    UserSteps[sessionId] = "development_requirement";

                    return await BuildResponse(
                        sessionId,
                        message,
                        "Awesome 🚀 Please briefly explain your requirement.",
                        "development_requirement");

                case "development_requirement":

                    if (message.Length < 5)
                    {
                        return await BuildResponse(
                            sessionId,
                            message,
                            "Please briefly explain your requirement.",
                            "development_requirement");
                    }

                    UserData[sessionId].Requirement +=
                        $"\nDiscussion: {message}";

                    UserSteps[sessionId] = "name";

                    return await BuildResponse(
                        sessionId,
                        message,
                        "Understood 👍 May I know your name?",
                        "name");

                case "staffing_requirement":

                    if (message.Length < 5)
                    {
                        return await BuildResponse(
                            sessionId,
                            message,
                            "Please share proper staffing requirement details.",
                            "staffing_requirement");
                    }

                    UserData[sessionId].Requirement +=
                        $"\nRequirement Details: {message}";

                    UserSteps[sessionId] = "name";

                    return await BuildResponse(
                        sessionId,
                        message,
                        "Perfect 👍 May I know your name?",
                        "name");

                case "name":

                    if (message.Length < 3)
                    {
                        return await BuildResponse(
                            sessionId,
                            message,
                            "Please enter a valid name.",
                            "name");
                    }

                    if (!Regex.IsMatch(
                        message,
                        @"^[a-zA-Z\s\.\-']+$"))
                    {
                        return await BuildResponse(
                            sessionId,
                            message,
                            "Name should contain only letters.",
                            "name");
                    }

                    UserData[sessionId].Name = message;

                    UserSteps[sessionId] = "email";

                    return await BuildResponse(
                        sessionId,
                        message,
                        "Thanks 😊 Please share your email address.",
                        "email");

                case "email":

                    if (message.Contains(" "))
                    {
                        return await BuildResponse(
                            sessionId,
                            message,
                            "Email should not contain spaces.",
                            "email");
                    }

                    bool isValidEmail = Regex.IsMatch(
                        message,
                        @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$");

                    if (!isValidEmail)
                    {
                        return await BuildResponse(
                            sessionId,
                            message,
                            "Please enter a valid email address.",
                            "email");
                    }

                    var emailDomain = message
                        .Split('@')
                        .Last()
                        .ToLower();

                    var blockedDomains = new[]
                    {
                    "gmaill.com",
                    "gmial.com",
                    "gmal.com",
                    "gmail.co",
                    "gmail.comm",
                    "gmail.cam",
                    "gmail.cum",
                    "gmail.con",
                    "yaho.com",
                    "outlok.com",
                    "hotmial.com"
                };

                    if (blockedDomains.Contains(emailDomain))
                    {
                        return await BuildResponse(
                            sessionId,
                            message,
                            "Please enter a valid email domain.",
                            "email");
                    }

                    var validTlds = new[]
                    {
                    ".com",
                    ".org",
                    ".net",
                    ".in",
                    ".co",
                    ".io",
                    ".ai"
                };

                    bool hasValidTld =
                        validTlds.Any(
                            tld => emailDomain.EndsWith(tld));

                    if (!hasValidTld)
                    {
                        return await BuildResponse(
                            sessionId,
                            message,
                            "Please enter a valid email domain.",
                            "email");
                    }

                    UserData[sessionId].Email = message;

                    await SaveLead(UserData[sessionId]);

                    UserSteps.Remove(sessionId);
                    UserData.Remove(sessionId);
                    SessionActivity.Remove(sessionId);

                    return await BuildResponse(
                        sessionId,
                        message,
                        "🎉 Thank you! Our team will contact you soon.\n\nFor quick assistance, you can also reach us at hr@pirnav.com",
                        "done",
                        new List<string>
                        {
                        "Restart",
                        "Support"
                        });

                default:

                    return await BuildResponse(
                        sessionId,
                        message,
                        "How else can I help you?",
                        "done");
            }
        }

        // ================= BUILD RESPONSE =================

        private async Task<ChatResponse> BuildResponse(
            string sessionId,
            string userMessage,
            string reply,
            string step,
            List<string>? suggestions = null)
        {
            await SaveChatLog(
                sessionId,
                userMessage,
                reply,
                step);

            return new ChatResponse
            {
                Reply = reply,
                Step = step,
                Suggestions = suggestions ?? new List<string>()
            };
        }

        // ================= SAVE LEAD =================

        private async Task SaveLead(Lead lead)
        {
            _context.Leads.Add(lead);

            await _context.SaveChangesAsync();

            var subject = "🚀 New Lead from Pirnav Chatbot";

            var body = $@"


<h2>New Lead Received</h2>

<p><b>Name:</b> {lead.Name}</p>

<p><b>Email:</b> {lead.Email}</p>

<p><b>Discussion Details:</b></p>

<div style='padding:15px;
background:#f5f5f5;
border-radius:8px;
line-height:1.8;
font-family:Segoe UI'>

{lead.Requirement?.Replace("\n", "<br/>")}

</div>
";


        var hrEmail =
            _configuration["EmailSettings:HrEmail"];

            if (!string.IsNullOrWhiteSpace(hrEmail))
            {
                await _emailService.SendEmailAsync(
                    hrEmail,
                    subject,
                    body);
            }
        }

        // ================= SAVE CHAT LOG =================

        private async Task SaveChatLog(
            string sessionId,
            string userMessage,
            string botReply,
            string step)
        {
            if (string.IsNullOrWhiteSpace(userMessage))
                return;

            var ignoredMessages = new[]
            {
            "hi",
            "hello",
            "hey",
            "ok",
            "thanks",
            "thank you"
        };

            if (ignoredMessages.Contains(userMessage.ToLower()))
                return;

            if (userMessage.Length > 1000)
                userMessage = userMessage.Substring(0, 1000);

            if (botReply.Length > 2000)
                botReply = botReply.Substring(0, 2000);

            var log = new ChatLog
            {
                SessionId = sessionId,
                UserMessage = userMessage,
                BotReply = botReply,
                Step = step,
                CreatedDate = DateTime.UtcNow
            };

            _context.ChatLogs.Add(log);

            await _context.SaveChangesAsync();
        }
    }


}
