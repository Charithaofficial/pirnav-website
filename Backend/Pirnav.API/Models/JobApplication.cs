public class JobApplication
{
    public int Id { get; set; }

    public int JobId { get; set; }
    public Job? Job { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }

    public string? HighestQualification { get; set; }
    public int? TotalExperience { get; set; }

    public string? CurrentCompany { get; set; }
    public decimal? CurrentCTC { get; set; }
    public decimal? ExpectedCTC { get; set; }

    public string? NoticePeriod { get; set; }
    public string? CurrentLocation { get; set; }
    public string? LinkedInUrl { get; set; }



    public string? ResumePath { get; set; }

    public string Status { get; set; } = "Pending";
    public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

    public bool IsDeleted { get; set; } = false;
}