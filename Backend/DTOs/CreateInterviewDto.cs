namespace Pirnav.API.DTOs
{
    public class CreateInterviewDto
    {
        public int ApplicationId { get; set; }

        public DateTime InterviewDate { get; set; }

        public TimeSpan InterviewTime { get; set; }

        public string Mode { get; set; }

        public string? MeetingLink { get; set; }

        public string? Notes { get; set; }

        public int ManagerId { get; set; }

    }
}