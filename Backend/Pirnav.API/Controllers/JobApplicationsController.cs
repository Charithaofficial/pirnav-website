using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Pirnav.API.Models;
using Pirnav.API.Services;
using Pirnav.API.Helpers;

namespace Pirnav.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly EmailService _emailService;
        private readonly JobApplicationService _jobApplicationService;
        private readonly FileUploadService _fileUploadService;
        private readonly IConfiguration _config;

        public JobApplicationsController(
            AppDbContext context,
            IWebHostEnvironment environment,
            EmailService emailService,
            JobApplicationService jobApplicationService,
            FileUploadService fileUploadService,
            IConfiguration config)
        {
            _context = context;
            _environment = environment;
            _emailService = emailService;
            _jobApplicationService = jobApplicationService;
            _fileUploadService = fileUploadService;
            _config = config;
        }

        // ================= APPLY JOB =================
        [AllowAnonymous]
        [HttpPost]
        [EnableRateLimiting("jobApplyLimiter")]
        public async Task<IActionResult> Apply([FromForm] JobApplicationRequest request)
        {
            request.Email = request.Email?.Trim().ToLower();

            if (EmailHelper.IsBlockedDomain(request.Email))
            {
                return BadRequest(new { message = "Temporary email addresses are not allowed." });
            }

            request.Name = InputSanitizer.Clean(request.Name ?? "");
            request.CurrentLocation = InputSanitizer.Clean(request.CurrentLocation ?? "");
            request.LinkedInUrl = InputSanitizer.Clean(request.LinkedInUrl ?? "");
            request.PhoneNumber = InputSanitizer.Clean(request.PhoneNumber ?? "");

            if (request.Resume == null)
                return BadRequest(new { message = "Resume is required" });

            if (!request.JobId.HasValue)
                return BadRequest(new { message = "JobId is required" });

            var jobExists = await _context.Jobs
                .AsNoTracking()
                .AnyAsync(x => x.Id == request.JobId.Value);

            if (!jobExists)
                return BadRequest(new { message = "Invalid Job Id" });

            //  CHECK DUPLICATE APPLICATION
            var alreadyApplied = await _context.JobApplications
                .AnyAsync(x => x.Email == request.Email && x.JobId == request.JobId);

            if (alreadyApplied)
            {
                return BadRequest(new { message = "You have already applied for this job" });
            }

            var resumePath = await _fileUploadService.UploadResumeAsync(request.Resume);

            if (resumePath == null)
                return BadRequest(new { message = "Invalid resume file." });

            var application = new JobApplication
            {
                JobId = request.JobId.Value,
                Name = request.Name,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Gender = request.Gender,
                TotalExperience = request.TotalExperience,
                CurrentCTC = request.CurrentCTC.HasValue ? (decimal)request.CurrentCTC.Value : null,
                ExpectedCTC = request.ExpectedCTC.HasValue ? (decimal)request.ExpectedCTC.Value : null,
                NoticePeriod = request.NoticePeriod,
                CurrentLocation = request.CurrentLocation,
                LinkedInUrl = request.LinkedInUrl,
                ResumePath = resumePath,
                Status = "Pending",
                AppliedDate = DateTime.UtcNow
            };

            await _jobApplicationService.AddApplication(application);

            // ================= EMAIL LOGIC START =================

            var logoUrl = "https://pirnav.com/images/pirnav_logo.png";

            var header = $@"
<div style='padding:25px;text-align:center;background:#ffffff;border-bottom:1px solid #e5e7eb'>
<img src='{logoUrl}' width='140' style='display:block;margin:auto;'/>
<h2 style='margin-top:15px;color:#111;font-weight:600'>Pirnav Careers</h2>
</div>";

            var footer = @"
<div style='text-align:center;padding:18px;background:#eef2f7;
font-size:12px;color:#555;line-height:1.6'>
<b>Pirnav Software Solutions Pvt Ltd</b><br/>
India, USA, UK, Canada<br/>
Email: hr.admin@pirnav.com
</div>";

            // ===== HR EMAIL =====
            var hrEmail = _config["EmailSettings:HrEmail"];
            if (!string.IsNullOrWhiteSpace(hrEmail))
            {
                await _emailService.SendEmailAsync(
                    hrEmail,
                    "New Job Application Received",
                    $@"
<div style='background:#f4f6f8;padding:30px'>
<div style='max-width:650px;margin:auto;background:#fff;border-radius:10px'>

{header}

<div style='padding:25px'>
<h3>New Candidate Application</h3>

<p><b>Name:</b> {application.Name}</p>
<p><b>Email:</b> {application.Email}</p>
<p><b>Phone:</b> {application.PhoneNumber}</p>

<p style='margin-top:15px'>Resume is attached in the system.</p>
</div>

{footer}

</div>
</div>"
                );
            }

            // ===== CANDIDATE EMAIL =====
            if (!string.IsNullOrWhiteSpace(application.Email))
            {
                await _emailService.SendEmailAsync(
                    application.Email,
                    "Application Received - Pirnav",
                    $@"
<div style='background:#f4f6f8;padding:30px'>
<div style='max-width:600px;margin:auto;background:#fff;border-radius:10px'>

{header}

<div style='padding:25px'>

<p>Dear <b>{application.Name}</b>,</p>

<p>Thank you for applying to <b>Pirnav Software Solutions Pvt Ltd</b>.</p>

<p>
We have received your job application successfully. Our HR team will review your profile and contact you if your qualifications match our requirements.
</p>

<p>
We appreciate your interest in joining our team.
</p>

</div>

{footer}

</div>
</div>"
                );
            }

            // ================= EMAIL LOGIC END =================

            return Ok(new { message = "Application submitted successfully" });
        }

        // ================= GET APPLICATIONS =================
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet]
        public async Task<IActionResult> GetApplications(
            int pageNumber = 1,
            int pageSize = 10,
            string? status = null,
            string? search = null,
            string sortBy = "AppliedDate",
            string sortOrder = "desc")
        {
            var query = _context.JobApplications
                .Where(x => !x.IsDeleted) 
                .AsNoTracking()
                .Include(x => x.Job)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(x => x.Status == status);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x =>
                    x.Name.Contains(search) ||
                    x.Email.Contains(search));
            }

            query = sortBy.ToLower() switch
            {
                "name" => sortOrder == "asc"
                    ? query.OrderBy(x => x.Name)
                    : query.OrderByDescending(x => x.Name),
                _ => sortOrder == "asc"
                    ? query.OrderBy(x => x.AppliedDate)
                    : query.OrderByDescending(x => x.AppliedDate)
            };

            var totalRecords = await query.CountAsync();

            var data = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Email,
                    x.PhoneNumber,
                    JobTitle = x.Job.JobTitle,
                    x.Status,
                    x.AppliedDate,
                    ResumeViewUrl = $"{Request.Scheme}://{Request.Host}/api/JobApplications/view/{x.Id}",
                    ResumeDownloadUrl = $"{Request.Scheme}://{Request.Host}/api/JobApplications/download/{x.Id}"
                })
                .ToListAsync();

            return Ok(new
            {
                totalRecords,
                pageNumber,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                data
            });
        }

        // ================= UPDATE STATUS =================
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var application = await _context.JobApplications
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted); 

            if (application == null)
                return NotFound(new { message = "Application not found" });

            var normalizedStatus = string.Equals(request.Status, "shortlisted", StringComparison.OrdinalIgnoreCase)
                ? "Shortlisted"
                : request.Status;

            application.Status = normalizedStatus;

            // ================= SHORTLIST EMAIL =================

            if (string.Equals(normalizedStatus, "Shortlisted", StringComparison.OrdinalIgnoreCase))
            {
                var logoUrl = "https://pirnav.com/images/pirnav_logo.png";

                var header = $@"
<div style='padding:25px;text-align:center;background:#ffffff;border-bottom:1px solid #e5e7eb'>
<img src='{logoUrl}' width='140' style='display:block;margin:auto;'/>
<h2 style='margin-top:15px;color:#111;font-weight:600'>Pirnav Careers</h2>
</div>";

                var footer = @"
<div style='text-align:center;padding:18px;background:#eef2f7;
font-size:12px;color:#555;line-height:1.6'>
<b>Pirnav Software Solutions Pvt Ltd</b><br/>
India, USA, UK, Canada<br/>
Email: hr.admin@pirnav.com
</div>";

                try
                {
                    await _emailService.SendEmailAsync(
                        application.Email,
                        "You are shortlisted - Pirnav",
                        $@"
<div style='background:#f4f6f8;padding:30px'>
<div style='max-width:600px;margin:auto;background:#fff;border-radius:10px'>

{header}

<div style='padding:25px'>

<p>Dear <b>{application.Name}</b>,</p>

<p>
Congratulations! You have been shortlisted for the next stage of the hiring process.
</p>

<p>
Our team will contact you shortly with interview details.
</p>

</div>

{footer}

</div>
</div>"
                    );
                }
                catch { }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated successfully" });
        }






        //===============resume=======================

        [HttpGet("view/{id}")]
        public IActionResult ViewResume(int id)
        {
            var application = _context.JobApplications
                .AsNoTracking()
                .FirstOrDefault(x => x.Id == id);

            if (application == null || string.IsNullOrEmpty(application.ResumePath))
                return NotFound();

            var filePath = Path.Combine(
                _environment.WebRootPath ?? "wwwroot",
                application.ResumePath.TrimStart('/'));

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var extension = Path.GetExtension(filePath).ToLower();

            var contentType = extension switch
            {
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };

            var fileBytes = System.IO.File.ReadAllBytes(filePath);

            //  Opens in browser
            return File(fileBytes, contentType);
        }





        [HttpGet("download/{id}")]
        public IActionResult DownloadResume(int id)
        {
            var application = _context.JobApplications
                .AsNoTracking()
                .FirstOrDefault(x => x.Id == id);

            if (application == null || string.IsNullOrEmpty(application.ResumePath))
                return NotFound();

            var filePath = Path.Combine(
                _environment.WebRootPath ?? "wwwroot",
                application.ResumePath.TrimStart('/'));

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var extension = Path.GetExtension(filePath).ToLower();

            var contentType = extension switch
            {
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };

            var fileBytes = System.IO.File.ReadAllBytes(filePath);

            var fileName = Path.GetFileName(filePath);
            return File(fileBytes, "application/octet-stream", fileName);
        }



        // ================= DELETE =================
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var application = await _context.JobApplications.FindAsync(id);

            if (application == null || application.IsDeleted)
                return NotFound(new { message = "Application not found" });


            application.IsDeleted = true; // ✅ soft delete

            await _context.SaveChangesAsync();

            return Ok(new { message = "Deleted successfully" });
        }

        // ================= DASHBOARD =================
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpGet("dashboard")]
        public IActionResult Dashboard()
        {
            return Ok(new
            {
                total = _context.JobApplications.Count(x => !x.IsDeleted),
                pending = _context.JobApplications.Count(x => x.Status == "Pending" && !x.IsDeleted),
                shortlisted = _context.JobApplications.Count(x => x.Status == "Shortlisted" && !x.IsDeleted),
                rejected = _context.JobApplications.Count(x => x.Status == "Rejected" && !x.IsDeleted),
                selected = _context.JobApplications.Count(x => x.Status == "Selected" && !x.IsDeleted)
            });
        }
    }
}
