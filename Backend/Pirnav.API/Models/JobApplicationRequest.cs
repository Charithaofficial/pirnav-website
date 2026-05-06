using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Pirnav.API.Validation;

namespace Pirnav.API.Models
{
    public class JobApplicationRequest
    {
        public int? JobId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{10}$")]
        public string PhoneNumber { get; set; }

        public string? CurrentLocation { get; set; }

        public string? Gender { get; set; }

        public int? TotalExperience { get; set; }

        public string? NoticePeriod { get; set; }

        public decimal? CurrentCTC { get; set; }

        public decimal? ExpectedCTC { get; set; }

        public string? LinkedInUrl { get; set; }

        
        public string? PortfolioUrl { get; set; }

        public string? GitHubUrl { get; set; }

        public string? SocialMediaLinks { get; set; }

        [Required]
        [AllowedExtensions(new string[] { ".pdf", ".doc", ".docx" })]
        [MaxFileSize(5 * 1024 * 1024)]
        public IFormFile Resume { get; set; }
    }
}