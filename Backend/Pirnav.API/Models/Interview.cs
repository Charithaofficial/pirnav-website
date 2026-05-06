using Pirnav.API.Models;

public class Interview
{
    public int Id { get; set; }

    public int ApplicationId { get; set; }

    public DateTime InterviewDate { get; set; }

    public TimeSpan InterviewTime { get; set; }

    public string Mode { get; set; }

    public string MeetingLink { get; set; }

    public string Notes { get; set; }

    public InterviewStatus Status { get; set; } = InterviewStatus.Scheduled;

    public int ManagerId { get; set; }
    public Manager Manager { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public JobApplication Application { get; set; }

    public string? FeedbackToken { get; set; }
    public bool ReminderSent { get; set; } = false;

    public bool IsDeleted { get; set; } = false;
}