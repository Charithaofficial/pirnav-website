using Microsoft.Extensions.Configuration;
using Pirnav.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pirnav.API.Services
{
    public class ChatService
    {
        private readonly AppDbContext _context;

        private readonly EmailService _emailService;

        private readonly IConfiguration _configuration;

        public ChatService(AppDbContext context, EmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        private static Dictionary<string, string> userSteps = new();
        private static Dictionary<string, Lead> userData = new();

        public async Task<ChatResponse> GetReply(string message, string sessionId)
        {
            if (!userSteps.ContainsKey(sessionId))
                userSteps[sessionId] = "start";

            if (!userData.ContainsKey(sessionId))
                userData[sessionId] = new Lead();

            var step = userSteps[sessionId];

            switch (step)
            {
                case "start":
                    userSteps[sessionId] = "route";

                    return new ChatResponse
                    {
                        Reply = "Hi 👋 Welcome to Pirnav! Please choose an option:",
                        Suggestions = new List<string>
        {
            "Development",
            "Staffing",
            "Support"
        },
                        Step = "route"
                    };


                case "route":

                    var msg = message.ToLower();

                    // ================= DEVELOPMENT FLOW =================

                    if (msg.Contains("development"))
                    {
                        userData[sessionId].Requirement = "Development";

                        userSteps[sessionId] = "development_type";

                        return new ChatResponse
                        {
                            Reply = "Great 👍 What type of development service are you looking for?",
                            Suggestions = new List<string>
            {
                "Web Development",
                "Mobile App",
                "UI/UX Design",
                "Custom Software",
                "Other"
            },
                            Step = "development_type"
                        };
                    }

                    // ================= STAFFING FLOW =================

                    if (msg.Contains("staffing"))
                    {
                        userData[sessionId].Requirement = "Staffing";

                        userSteps[sessionId] = "staffing_requirement";

                        return new ChatResponse
                        {
                            Reply = "Great 👍 Please share your staffing requirement.",
                            Suggestions = new List<string>(),
                            Step = "staffing_requirement"
                        };
                    }

                    // ================= SUPPORT FLOW =================

                    if (msg.Contains("support"))
                    {
                        userSteps[sessionId] = "done";

                        return new ChatResponse
                        {
                            Reply = "Our support team will contact you shortly.\n\nYou can also reach us at hr@pirnav.com",
                            Suggestions = new List<string>(),
                            Step = "done"
                        };
                    }

                    return new ChatResponse
                    {
                        Reply = "Please choose a valid option.",
                        Suggestions = new List<string>
        {
            "Development",
            "Staffing",
            "Support"
        },
                        Step = "route"
                    };

                case "development_type":

                    userData[sessionId].Requirement +=
                        $"\nService Type: {message}";

                    userSteps[sessionId] = "development_requirement";

                    return new ChatResponse
                    {
                        Reply = "Awesome 🚀 Please briefly describe your requirement.",
                        Suggestions = new List<string>(),
                        Step = "development_requirement"
                    };

                case "development_requirement":

                    userData[sessionId].Requirement +=
                        $"\nDiscussion: {message}";

                    userSteps[sessionId] = "name";

                    return new ChatResponse
                    {
                        Reply = "Got it 👍 May I know your name?",
                        Suggestions = new List<string>(),
                        Step = "name"
                    };

                case "staffing_requirement":

                    userData[sessionId].Requirement +=
                        $"\nRequirement Details: {message}";

                    userSteps[sessionId] = "name";

                    return new ChatResponse
                    {
                        Reply = "Thanks 👍 May I know your name?",
                        Suggestions = new List<string>(),
                        Step = "name"
                    };
            

                case "name":
                    if (message.Length < 3)
                    {
                        return new ChatResponse
                        {
                            Reply = "Please enter a valid name.",
                            Step = "name"
                        };
                    }

                    userData[sessionId].Name = message;

                    userSteps[sessionId] = "email";

                return new ChatResponse
                {
                    Reply = "Thanks 😊 Please share your email.",
                    Step = "email"
                };

            case "email":

                // ================= EMAIL FORMAT VALIDATION =================

                bool isValidEmail =
                    System.Text.RegularExpressions.Regex.IsMatch(
                        message,
                        @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    );

                if (!isValidEmail)
                {
                    return new ChatResponse
                    {
                        Reply = "Please enter a valid email address.",
                        Step = "email"
                    };
                }

                // ================= DOMAIN VALIDATION =================

                if (!IsValidEmailDomain(message))
                {
                    return new ChatResponse
                    {
                        Reply = "Please enter a valid email domain.",
                        Step = "email"
                    };
                }

                userData[sessionId].Email = message;

                userSteps[sessionId] = "done";

                await SaveLead(userData[sessionId]);

                return new ChatResponse
                {
                    Reply = "🎉 Thank you! Our team will contact you soon.\n\nFor quick assistance, you can also reach us at hr@pirnav.com",
                    Step = "done"
                };
            default:
                return new ChatResponse
                {
                    Reply = "How else can I help you?",
                    Step = "done"
                };
            }
        }

        private async Task SaveLead(Lead lead)
        {
            _context.Leads.Add(lead);
            await _context.SaveChangesAsync();

            var subject = "🚀 New Lead from Pirnav Chatbot";

            var body = $@"
        <h3>New Lead Received</h3>
        <p><b>Name:</b> {lead.Name}</p>
        <p><b>Email:</b> {lead.Email}</p>
        <p><b>Discussion Details:</b></p>

<div style='padding:10px;background:#f5f5f5;
border-radius:6px;line-height:1.6'>
{lead.Requirement?.Replace("\n", "<br/>")}
</div>
    ";

            var hrEmail = _configuration["EmailSettings:HrEmail"];

            await _emailService.SendEmailAsync(
                hrEmail,
                subject,
                body
            );
        }


        private bool IsValidEmailDomain(string email)
        {
            try
            {
                var domain = email.Split('@').Last();

                return System.Net.Dns
                    .GetHostEntry(domain) != null;
            }
            catch
            {
                return false;
            }
        }
    }
}