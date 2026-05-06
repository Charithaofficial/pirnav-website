using FluentValidation;
using Pirnav.API.Models;
using System.Text.RegularExpressions;

namespace Pirnav.API.Validation
{
    public class JobApplicationValidator : AbstractValidator<JobApplicationRequest>
    {
        public JobApplicationValidator()
        {
            RuleFor(x => x.Name)
    .NotEmpty().WithMessage("Name is required")
    .Must(name => !string.IsNullOrWhiteSpace(name))
    .WithMessage("Name is required")
    .MinimumLength(3)
    .MaximumLength(100)
    .Matches(@"^[a-zA-Z\s]+$")
    .WithMessage("Name must contain only letters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .Must(email => email != null && email.Trim() == email)
                .WithMessage("Email should not contain spaces");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required")
                .Matches(@"^[6-9][0-9]{9}$")
                .WithMessage("Enter valid Indian phone number");

            // LINKEDIN
            RuleFor(x => x.LinkedInUrl)
                .Must(BeValidLinkedIn)
                .When(x => !string.IsNullOrWhiteSpace(x.LinkedInUrl))
                .WithMessage("Invalid LinkedIn profile URL");

            // EXPERIENCE
            RuleFor(x => x.TotalExperience)
                .InclusiveBetween(0, 40)
                .When(x => x.TotalExperience.HasValue)
                .WithMessage("Experience must be between 0 and 40 years");

            // CURRENT CTC
            RuleFor(x => x.CurrentCTC)
                .GreaterThanOrEqualTo(0)
                .When(x => x.CurrentCTC.HasValue)
                .WithMessage("Current CTC cannot be negative");

            // EXPECTED CTC
            RuleFor(x => x.ExpectedCTC)
                .GreaterThanOrEqualTo(0)
                .When(x => x.ExpectedCTC.HasValue)
                .WithMessage("Expected CTC cannot be negative");

            // EXPECTED CTC >= CURRENT CTC
            RuleFor(x => x.ExpectedCTC)
                .GreaterThanOrEqualTo(x => x.CurrentCTC)
                .When(x => x.ExpectedCTC.HasValue && x.CurrentCTC.HasValue)
                .WithMessage("Expected CTC must be greater than or equal to Current CTC");
        }

        private bool BeValidLinkedIn(string? url)
        {
            if (string.IsNullOrWhiteSpace(url))
                return true; 

            return Regex.IsMatch(
                url,
                @"^(https?:\/\/)?(www\.)?linkedin\.com\/.*$",
                RegexOptions.IgnoreCase
            );
        }
    }
}