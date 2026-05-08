using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pirnav.API.Models;

[Table("AdminUsers")]
public partial class AdminUser
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Role { get; set; } = null!;

    public DateTime? CreatedDate { get; set; }

    public string? Email { get; set; }

    //public string? PhoneNumber { get; set; }
}