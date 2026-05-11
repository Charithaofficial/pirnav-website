using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pirnav.API.Controllers.Base;
using Pirnav.API.DTOs;
using Pirnav.API.Models;
using Pirnav.API.Services;

namespace Pirnav.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        private readonly EmailService _emailService;

        private static readonly Dictionary<string, (string Otp, DateTime Expiry)> OtpStore
    = new();

        public AdminController(
    AppDbContext context,
    AuthService authService,
    EmailService emailService)
        {
            _context = context;
            _authService = authService;
            _emailService = emailService;
        }

        // ================= LOGIN =================

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginRequest request)
        {
            var result = await _authService.LoginAsync(request.Email, request.Password);

            if (!result.Success)
                return UnauthorizedResponse(result.Message);

            return Success(result.Message, new
            {
                token = result.Token
            });
        }


        // ================= CREATE ADMIN (SUPER ADMIN ONLY) =================

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AdminRegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);

            if (!result.Success)
                return Fail(result.Message);

            return Success("Admin created successfully", new
            {
                email = dto.Email
            });
        }





        // ================= GET ALL ADMINS =================

        [Authorize(Roles = "Admin, SuperAdmin")]
        [HttpGet("admins")]
        public async Task<IActionResult> GetAdmins()
        {
            var admins = await _context.AdminUsers
                .AsNoTracking()
                .Select(x => new
                {
                    id = x.Id,
                    username = x.Username,
                    email = x.Email,
                    role = x.Role,
                    createdDate = x.CreatedDate
                })
                .ToListAsync();

            return Success("Admin list fetched successfully", admins);
        }



        // ================= DELETE ADMIN =================

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("delete-admin/{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            var admin = await _context.AdminUsers.FindAsync(id);

            if (admin == null)
                return Fail("Admin not found");

            // Prevent deleting another SuperAdmin

            if (admin.Role == "SuperAdmin")
                return Fail("SuperAdmin cannot be deleted");

            // Prevent deleting yourself

            var currentUserId = GetUserId();

            if (admin.Id == currentUserId)
                return Fail("You cannot delete your own account");

            _context.AdminUsers.Remove(admin);

            await _context.SaveChangesAsync();

            return Success("Admin deleted successfully");
        }

        // ================= DASHBOARD SUMMARY =================

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var unreadMessages = await _context.ContactMessages
                .CountAsync(x => x.Status == "Unread");

            var openPositions = await _context.Jobs
                .CountAsync(x => x.IsActive == true);

            var pendingReviews = await _context.JobApplications
                .CountAsync(x => x.Status == "Pending");

            var activeServices = await _context.Services
                .CountAsync(x => x.IsActive == true);

            return Success("Dashboard summary fetched", new
            {
                activeServices,
                unreadMessages,
                openPositions,
                pendingReviews
            });
        }


        // ================= RECENT APPLICATIONS =================

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet("recent-applications")]
        public async Task<IActionResult> GetRecentApplications()
        {
            var applications = await _context.JobApplications
                .Where(x => !x.IsDeleted)
                .AsNoTracking()
                .Include(x => x.Job)
                .OrderByDescending(x => x.AppliedDate)
                .Take(5)
                .Select(x => new
                {
                    name = x.Name,
                    position = x.Job.JobTitle,
                    status = x.Status,
                    appliedDate = x.AppliedDate
                })
                .ToListAsync();

            return Success("Recent applications fetched", applications);
        }


        // ================= RECENT MESSAGES =================

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet("recent-messages")]
        public async Task<IActionResult> GetRecentMessages()
        {
            var messages = await _context.ContactMessages
                .AsNoTracking()
                .OrderByDescending(x => x.CreatedDate)
                .Take(5)
                .Select(x => new
                {
                    name = x.Name,
                    email = x.Email,
                    subject = x.Subject,
                    message = x.Message,
                    date = x.CreatedDate
                })
                .ToListAsync();

            return Success("Recent messages fetched", messages);
        }



        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();

            var admin = await _context.AdminUsers
                .Where(x => x.Id == userId)
                .Select(x => new
                {
                    x.Id,
                    username = x.Username,
                    email = x.Email,
                    role = x.Role,
                   // phoneNumber = x.PhoneNumber
                })
                .FirstOrDefaultAsync();

            if (admin == null)
                return Fail("Admin not found");

            return Success("Profile fetched", admin);
        }





        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] AdminProfileUpdateDto dto)
        {
            var userId = GetUserId();

            var admin = await _context.AdminUsers.FindAsync(userId);

            if (admin == null)
                return Fail("Admin not found");

            admin.Username = dto.Username;
            admin.Email = dto.Email;
            //admin.PhoneNumber = dto.PhoneNumber;

            await _context.SaveChangesAsync();

            return Success("Profile updated successfully");
        }




        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = GetUserId();

            var admin = await _context.AdminUsers.FindAsync(userId);

            if (admin == null)
                return Fail("Admin not found");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, admin.PasswordHash))
                return Fail("Current password is incorrect");

            if (dto.NewPassword != dto.ConfirmPassword)
                return Fail("Passwords do not match");

            admin.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _context.SaveChangesAsync();

            return Success("Password updated successfully");
        }






        [AllowAnonymous]
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpDto dto)
        {

            if (string.IsNullOrWhiteSpace(dto.Email))
                return Fail("Email is required");

            if (!System.Text.RegularExpressions.Regex.IsMatch(
                dto.Email,
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                return Fail("Invalid email format");
            }

            var admin = await _context.AdminUsers
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (admin == null)
                return Fail("Email not found");

            var otp = new Random().Next(100000, 999999).ToString();

            OtpStore[dto.Email] = (
    otp,
    DateTime.UtcNow.AddMinutes(5)
);

            try
            {
                await _emailService.SendEmailAsync(
                    dto.Email,
                    "Pirnav Password Reset OTP",
                    $@"
            <h3>Password Reset OTP</h3>
            <p>Your OTP is:</p>
            <h2>{otp}</h2>
            <p>This OTP is valid for a short time.</p>"
                );

                return Success("OTP sent successfully");
            }
            catch
            {
                return Fail("Failed to send OTP");
            }
        }



        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {

            if (string.IsNullOrWhiteSpace(dto.Email))
                return Fail("Email is required");

            if (string.IsNullOrWhiteSpace(dto.Otp))
                return Fail("OTP is required");

            if (string.IsNullOrWhiteSpace(dto.NewPassword))
                return Fail("New password is required");

            if (string.IsNullOrWhiteSpace(dto.ConfirmPassword))
                return Fail("Confirm password is required");

            if (dto.NewPassword.Length < 6)
                return Fail("Password must be at least 6 characters");


            var admin = await _context.AdminUsers
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (admin == null)
                return Fail("Invalid email");

            if (!OtpStore.ContainsKey(dto.Email))
            {
                return Fail("OTP not found");
            }

            var storedOtp = OtpStore[dto.Email];

            if (DateTime.UtcNow > storedOtp.Expiry)
            {
                OtpStore.Remove(dto.Email);
                return Fail("OTP expired");
            }

            if (storedOtp.Otp != dto.Otp)
            {
                return Fail("Invalid OTP");
            }

            if (dto.NewPassword != dto.ConfirmPassword)
                return Fail("Password mismatch");

            if (BCrypt.Net.BCrypt.Verify(dto.NewPassword, admin.PasswordHash))
                return Fail("Password should not be same as before");

            admin.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _context.SaveChangesAsync();

            OtpStore.Remove(dto.Email);

            return Success("Password reset successful");
        }














    }
}