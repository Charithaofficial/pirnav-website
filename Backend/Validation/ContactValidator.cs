using FluentValidation;
using Pirnav.API.Models;

namespace Pirnav.API.Validation
{
    public class ContactValidator : AbstractValidator<ContactMessage>
    {
        public ContactValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Enter a valid name")
                .MinimumLength(2)
                .MaximumLength(50)
                .Matches(@"^[a-zA-Z\s]+$").WithMessage("Enter a valid name");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Enter a valid email")
                .EmailAddress().WithMessage("Enter a valid email");

            RuleFor(x => x.Subject)
                .NotEmpty().WithMessage("Subject is required")
                .MaximumLength(100);

            RuleFor(x => x.Message)
                .NotEmpty().WithMessage("Message is required")
                .MaximumLength(1000);
        }
    }
}