using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pirnav.API.Controllers.Base;
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
    }
}