namespace Pirnav.API.DTOs
{
    public class AdminProfileUpdateDto
    {
        public string Username { get; set; } = string.Empty;

        public string? Email { get; set; }

        //public string? PhoneNumber { get; set; }
    }
}