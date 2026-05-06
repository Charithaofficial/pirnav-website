using FluentValidation;
using Pirnav.API.DTOs;

namespace Pirnav.API.Validation
{
    public class InterviewValidator : AbstractValidator<CreateInterviewDto>
    {
        public InterviewValidator()
        {
            RuleFor(x => x.ApplicationId)
                .GreaterThan(0).WithMessage("Invalid Application");

            RuleFor(x => x.ManagerId)
                .GreaterThan(0).WithMessage("Invalid Manager");

            RuleFor(x => x.InterviewDate)
                .NotEmpty().WithMessage("Interview date is required");

            RuleFor(x => x.InterviewTime)
                .NotEmpty().WithMessage("Interview time is required");

            RuleFor(x => x.Mode)
                .NotEmpty().WithMessage("Mode is required");

            RuleFor(x => x.MeetingLink)
                .Must(link => string.IsNullOrWhiteSpace(link) || Uri.IsWellFormedUriString(link, UriKind.Absolute))
                .WithMessage("Invalid meeting link");

            RuleFor(x => x.Notes)
                .MaximumLength(500)
                .When(x => !string.IsNullOrWhiteSpace(x.Notes));
        }
    }
}