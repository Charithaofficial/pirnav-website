using Microsoft.EntityFrameworkCore;
using Pirnav.API.Models;

namespace Pirnav.API.Services
{
    public class InterviewReminderService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public InterviewReminderService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Console.WriteLine("✅ Reminder Service Started");

            while (!stoppingToken.IsCancellationRequested)
            {
                Console.WriteLine("🔄 Checking reminders...");

                await CheckAndSendReminders();

                // Runs every 30 minutes
                await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
            }
        }

        private async Task CheckAndSendReminders()
        {
            // 🚫 DISABLED FOR PRODUCTION 
            return;

            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<EmailService>();

            var now = DateTime.Now;
            var nextHour = now.AddHours(1);

            var interviews = await context.Interviews
                .Include(i => i.Application)
                .Include(i => i.Manager)
                .Where(i =>
                    i.Status == InterviewStatus.Scheduled &&
                    !i.ReminderSent
                )
                .ToListAsync();

            interviews = interviews
                .Where(i =>
                {
                    var interviewDateTime = i.InterviewDate.Date + i.InterviewTime;
                    return interviewDateTime >= now && interviewDateTime <= nextHour;
                })
                .ToList();

            Console.WriteLine($"📌 Interviews Found: {interviews.Count}");

            foreach (var interview in interviews)
            {
                var candidate = interview.Application;
                var manager = interview.Manager;

                string formattedDate = interview.InterviewDate.ToString("dddd, dd MMM yyyy");
                string formattedTime = DateTime.Today.Add(interview.InterviewTime).ToString("hh:mm tt");

                string meetingLink = string.IsNullOrEmpty(interview.MeetingLink)
                    ? "#"
                    : interview.MeetingLink;

                string candidateBody = $@"
<h3>Interview Reminder</h3>
<p>Dear {candidate.Name},</p>
 
<p>This is a reminder that your interview is scheduled soon.</p>
 
<ul>
<li><b>Date:</b> {formattedDate}</li>
<li><b>Time:</b> {formattedTime}</li>
<li><b>Mode:</b> {interview.Mode}</li>
<li><b>Meeting Link:</b> <a href='{meetingLink}'>Join Here</a></li>
</ul>
 
<p>Best Regards,<br/>Pirnav Team</p>";

                await emailService.SendEmailAsync(
                    candidate.Email,
                    "Interview Reminder",
                    candidateBody
                );

                if (manager != null && !string.IsNullOrEmpty(manager.Email))
                {
                    string managerBody = $@"
<h3>Interview Reminder</h3>
 
<p>You have an upcoming interview.</p>
 
<ul>
<li><b>Candidate:</b> {candidate.Name}</li>
<li><b>Date:</b> {formattedDate}</li>
<li><b>Time:</b> {formattedTime}</li>
<li><b>Mode:</b> {interview.Mode}</li>
<li><b>Meeting Link:</b> <a href='{meetingLink}'>Join Here</a></li>
</ul>
 
<p>Best Regards,<br/>Pirnav Team</p>";

                    await emailService.SendEmailAsync(
                        manager.Email,
                        "Interview Reminder",
                        managerBody
                    );
                }

                interview.ReminderSent = true;
            }

            await context.SaveChangesAsync();
        }
    }
}