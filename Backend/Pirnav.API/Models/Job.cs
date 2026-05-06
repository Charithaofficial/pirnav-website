using Pirnav.API.Models;

public partial class Job
{
    public int Id { get; set; }

    public string JobTitle { get; set; } = null!;

    public string? WorkLocation { get; set; }

    public string? JobType { get; set; }

    public string? Status { get; set; }

    public string? Experience { get; set; }

    public string? CTC { get; set; }

    public string? HighestQualification { get; set; }

    public string? JobDescription { get; set; }

    public string? MandatorySkills { get; set; }

    public DateTime? CreatedDate { get; set; }

    public bool? IsActive { get; set; }

    
    public virtual ICollection<JobApplication> JobApplications { get; set; } = new List<JobApplication>();
}