namespace Pirnav.API.Models
{
    public class Service
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Icon { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}