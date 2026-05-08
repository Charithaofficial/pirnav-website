using System.ComponentModel.DataAnnotations.Schema;

namespace Pirnav.API.Models
{
    [Table("Managers")]
    public class Manager
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }
    }
}