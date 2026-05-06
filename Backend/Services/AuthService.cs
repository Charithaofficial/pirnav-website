using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pirnav.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Pirnav.API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(bool Success, string Message, string? Token)> LoginAsync(string email, string password)
        {
            var admin = await _context.AdminUsers
                .FirstOrDefaultAsync(x => x.Email == email);

            if (admin == null || !BCrypt.Net.BCrypt.Verify(password, admin.PasswordHash))
            {
                return (false, "Invalid email or password", null);
            }

            var token = GenerateJwtToken(admin);

            return (true, "Login successful", token);
        }

        public async Task<(bool Success, string Message, string? Token)> RegisterAsync(AdminRegisterDto dto)
        {
            if (await _context.AdminUsers.AnyAsync(x => x.Email == dto.Email))
            {
                return (false, "Email already registered", null);
            }

            if (await _context.AdminUsers.AnyAsync(x => x.Username == dto.Username))
            {
                return (false, "Username already exists", null);
            }

            var admin = new AdminUser
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Admin",
                CreatedDate = DateTime.UtcNow
            };

            _context.AdminUsers.Add(admin);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(admin);

            return (true, "Admin registered successfully", token);
        }

        private string GenerateJwtToken(AdminUser admin)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");

            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()), // ⭐ user id
        new Claim(ClaimTypes.Name, admin.Email ?? ""),
        new Claim(ClaimTypes.Role, admin.Role ?? "Admin"),
        new Claim("username", admin.Username)
    };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(jwtSettings["DurationInMinutes"])),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}