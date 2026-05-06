public class InterviewFeedback
{
    public int Id { get; set; }
    public int InterviewId { get; set; }
    public int CandidateId { get; set; }
    public int InterviewerId { get; set; }

    public int Rating { get; set; }
    public string Comments { get; set; }
    public string Status { get; set; } // Selected / Rejected / Hold

    public string? AdminDecision { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public bool IsDeleted { get; set; } = false;
}