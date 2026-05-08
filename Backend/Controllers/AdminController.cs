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

        public AdminController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
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
                    id = x.Id,
                    username = x.Username,
                    email = x.Email,
                    role = x.Role
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

            var username = dto.Username?.Trim();
            var email = dto.Email?.Trim();

            if (string.IsNullOrWhiteSpace(username))
                return Fail("Username is required");

            if (string.IsNullOrWhiteSpace(email))
                return Fail("Email is required");

            var emailExists = await _context.AdminUsers
                .AnyAsync(x => x.Id != userId && x.Email == email);

            if (emailExists)
                return Fail("Email already registered");

            var usernameExists = await _context.AdminUsers
                .AnyAsync(x => x.Id != userId && x.Username == username);

            if (usernameExists)
                return Fail("Username already exists");

            admin.Username = username;
            admin.Email = email;

            await _context.SaveChangesAsync();

            return Success("Profile updated successfully", new
            {
                id = admin.Id,
                username = admin.Username,
                email = admin.Email,
                role = admin.Role
            });
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] AdminChangePasswordDto dto)
        {
            var userId = GetUserId();

            var admin = await _context.AdminUsers.FindAsync(userId);

            if (admin == null)
                return Fail("Admin not found");

            if (string.IsNullOrWhiteSpace(dto.CurrentPassword) ||
                string.IsNullOrWhiteSpace(dto.NewPassword) ||
                string.IsNullOrWhiteSpace(dto.ConfirmPassword))
            {
                return Fail("All password fields are required");
            }

            if (dto.NewPassword != dto.ConfirmPassword)
                return Fail("New password and confirm password do not match");

            if (dto.NewPassword.Length < 8)
                return Fail("New password must be at least 8 characters");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, admin.PasswordHash))
                return Fail("Current password is incorrect");

            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _context.SaveChangesAsync();

            return Success("Password changed successfully");
        }






        ////[Authorize(Roles = "Admin,SuperAdmin")]
        ////[HttpPost("upload-profile-photo")]
        ////public async Task<IActionResult> UploadProfilePhoto(IFormFile file)
        ////{
        ////    if (file == null || file.Length == 0)
        ////        return Fail("No file uploaded");

        ////    var userId = GetUserId();

        ////    var admin = await _context.AdminUsers.FindAsync(userId);

        ////    if (admin == null)
        ////        return Fail("Admin not found");

        ////    var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/profile");

        ////    if (!Directory.Exists(folder))
        ////        Directory.CreateDirectory(folder);

        ////    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        ////    var filePath = Path.Combine(folder, fileName);

        ////    using (var stream = new FileStream(filePath, FileMode.Create))
        ////    {
        ////        await file.CopyToAsync(stream);
        ////    }

        ////    admin.ProfileImage = "/uploads/profile/" + fileName;

        ////    await _context.SaveChangesAsync();

        ////    return Success("Photo uploaded", new
        ////    {
        ////        imageUrl = admin.ProfileImage
        ////    });
        ////}

        //[Authorize(Roles = "Admin,SuperAdmin")]
        //[HttpDelete("remove-profile-photo")]
        //public async Task<IActionResult> RemoveProfilePhoto()
        //{
        //    var userId = GetUserId();

        //    var admin = await _context.AdminUsers.FindAsync(userId);

        //    if (admin == null)
        //        return Fail("Admin not found");

        //    admin.ProfileImage = null;

        //    await _context.SaveChangesAsync();

        //    return Success("Profile photo removed");
        //}

    }
}
