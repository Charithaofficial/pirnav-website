namespace Pirnav.API.DTOs
{
    public class AdminProfileUpdateDto
    {
        public string Username { get; set; } = string.Empty;

        public string? Email { get; set; }

    }

    public class AdminChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;

        public string NewPassword { get; set; } = string.Empty;

        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
