using Pirnav.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Pirnav.API.Services
{
    public static class DbSeeder
    {
        public static void Seed(IServiceProvider serviceProvider)
        {
            using var context = serviceProvider.GetRequiredService<AppDbContext>();

            // Ensure DB created (MySQL friendly)
            context.Database.EnsureCreated();

            // Create default admin
            if (!context.AdminUsers.Any(x => x.Email == "admin@pirnav.com"))
            {
                var admin = new AdminUser
                {
                    Username = "admin",
                    Email = "admin@pirnav.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "SuperAdmin",
                    CreatedDate = DateTime.UtcNow
                };

                context.AdminUsers.Add(admin);
                context.SaveChanges();
            }
        }
    }
}