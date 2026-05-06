using FluentValidation;
using Pirnav.API.DTOs;

namespace Pirnav.API.Validation
{
    public class JobValidator : AbstractValidator<JobCreateDto>
    {
        public JobValidator()
        {
            RuleFor(x => x.JobTitle)
                .NotEmpty().WithMessage("Job title is required")
                .Must(x => !string.IsNullOrWhiteSpace(x)).WithMessage("Job title is required")
                .MaximumLength(100).WithMessage("Job title cannot exceed 100 characters");

            RuleFor(x => x.WorkLocation)
                .NotEmpty().WithMessage("Work location is required")
                .Must(x => !string.IsNullOrWhiteSpace(x)).WithMessage("Work location is required");

            RuleFor(x => x.JobType)
                .NotEmpty().WithMessage("Job type is required")
                .Must(x => !string.IsNullOrWhiteSpace(x)).WithMessage("Job type is required");

            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required")
                .Must(status => status != null &&
                    (status.ToLower() == "open" || status.ToLower() == "closed"))
                .WithMessage("Status must be 'open' or 'closed'");

            RuleFor(x => x.Experience)
    .NotEmpty().WithMessage("Experience is required")
    .Matches(@"^\d+(-\d+)?\s?(years|Years)?$")
    .WithMessage("Experience must be like '2-5 years'");

            RuleFor(x => x.CTC)
    .NotEmpty().WithMessage("CTC is required")
    .Matches(@"^\d+(-\d+)?\s?(LPA|lpa)$")
    .WithMessage("CTC must be like '5-8 LPA'");

            RuleFor(x => x.JobDescription)
                .NotEmpty().WithMessage("Job description is required")
                .Must(x => !string.IsNullOrWhiteSpace(x)).WithMessage("Job description is required")
                .MaximumLength(2000).WithMessage("Job description too long");

            RuleFor(x => x.MandatorySkills)
                .NotEmpty().WithMessage("Mandatory skills are required")
                .Must(x => !string.IsNullOrWhiteSpace(x)).WithMessage("Mandatory skills are required")
                .MaximumLength(500).WithMessage("Skills too long");
        }
    }
}