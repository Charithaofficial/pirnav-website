using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pirnav.API.Models
{
    [Table("Leads")]
    public class Lead
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Requirement { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}