using System.ComponentModel.DataAnnotations.Schema;

namespace Pirnav.API.Models
{
    [Table("Services")]
    public class Service
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Icon { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}