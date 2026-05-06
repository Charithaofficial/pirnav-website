using System;
using System.Collections.Generic;

namespace Pirnav.API.Models;

public partial class AdminUser
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Role { get; set; } = null!;

    public DateTime? CreatedDate { get; set; }

    public string? Email { get; set; }
}
