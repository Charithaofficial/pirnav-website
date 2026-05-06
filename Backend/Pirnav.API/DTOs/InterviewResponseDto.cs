namespace Pirnav.API.DTOs
{
    public class InterviewResponseDto
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public string CandidateName { get; set; }
        public string Email { get; set; }
        public string JobTitle { get; set; }

        //  IMPORTANT: single datetime
        public DateTime ScheduledAt { get; set; }

        public string Mode { get; set; }
        public string MeetingLink { get; set; }
        public string Notes { get; set; }

        public string Status { get; set; }

        public string ManagerName { get; set; }
    }
}