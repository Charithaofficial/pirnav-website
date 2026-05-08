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

                    // 👉 Support flow
                    if (msg.Contains("support"))
                    {
                        userSteps[sessionId] = "done";

                        return new ChatResponse
                        {
                            Reply = "Our support team will contact you shortly.",
                            Suggestions = new List<string>(),
                            Step = "done"
                        };
                    }

                    // 👉 Default → Lead flow
                    userData[sessionId].Requirement = message;
                    userSteps[sessionId] = "name";

                    return new ChatResponse
                    {
                        Reply = "Great 👍 May I know your name?",
                        Suggestions = new List<string>(),
                        Step = "name"
                    };

                case "requirement":
                    userData[sessionId].Requirement = message;
                    userSteps[sessionId] = "name";

                    return new ChatResponse
                    {
                        Reply = "Great 👍 May I know your name?",
                        Step = "name"
                    };

                case "name":
                    userData[sessionId].Name = message;
                    userSteps[sessionId] = "email";

                    return new ChatResponse
                    {
                        Reply = "Thanks 😊 Please share your email.",
                        Step = "email"
                    };

                case "email":
                    userData[sessionId].Email = message;
                    userSteps[sessionId] = "done";

                    await SaveLead(userData[sessionId]);

                    return new ChatResponse
                    {
                        Reply = "🎉 Thank you! Our team will contact you soon.",
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
        <p><b>Requirement:</b> {lead.Requirement}</p>
    ";

            var hrEmail = _configuration["EmailSettings:HrEmail"];

            await _emailService.SendEmailAsync(
                hrEmail,
                subject,
                body
            );
        }
    }
}