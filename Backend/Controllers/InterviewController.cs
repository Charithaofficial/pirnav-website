using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pirnav.API.DTOs;
using Pirnav.API.Models;
using Pirnav.API.Services;
using static System.Net.Mime.MediaTypeNames;

namespace Pirnav.API.Controllers
{
    [Authorize(Roles = "Admin, SuperAdmin")]
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public InterviewController(AppDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // ================= GET =================
        [HttpGet]
        public IActionResult GetAll()
        {
            var interviews = _context.Interviews
                .Where(i => !i.IsDeleted) // ✅ Added filter
                .Include(i => i.Application).ThenInclude(a => a.Job)
                .Include(i => i.Manager)
                .Select(i => new
                {
                    i.Id,
                    ApplicationId = i.ApplicationId,
                    CandidateName = i.Application.Name,
                    Email = i.Application.Email,
                    JobTitle = i.Application.Job.JobTitle,
                    ScheduledAt = i.InterviewDate.Add(i.InterviewTime),
                    i.Mode,
                    i.MeetingLink,
                    i.Notes,
                    Status = i.Status.ToString(),
                    Interviewer = i.Manager.Name
                })
                .ToList();

            return Ok(interviews);
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInterviewDto dto)
        {
            var application = await _context.JobApplications
                .Include(x => x.Job)
                .FirstOrDefaultAsync(x => x.Id == dto.ApplicationId);

            if (application == null)
                return BadRequest("Invalid Application");

            var formattedName = System.Globalization.CultureInfo.CurrentCulture.TextInfo
                .ToTitleCase((application.Name ?? "").ToLower());

            var manager = await _context.Managers.FindAsync(dto.ManagerId);
            if (manager == null)
                return BadRequest("Invalid Manager");

            var interview = new Interview
            {
                ApplicationId = dto.ApplicationId,
                InterviewDate = dto.InterviewDate,
                InterviewTime = dto.InterviewTime,
                Mode = dto.Mode,
                MeetingLink = dto.MeetingLink,
                Notes = dto.Notes,
                ManagerId = dto.ManagerId,
                Status = InterviewStatus.Scheduled,
                CreatedAt = DateTime.Now,
                FeedbackToken = Guid.NewGuid().ToString(),
            };

            _context.Interviews.Add(interview);
            await _context.SaveChangesAsync();

            // ================= EMAIL LOGIC START =================

            var logoUrl = "https://pirnav.com/images/pirnav_logo.png";

            string meetingLink = string.IsNullOrEmpty(dto.MeetingLink) ? "#" : dto.MeetingLink;

            string formattedDate = dto.InterviewDate.ToString("dddd, dd MMM yyyy");
            string formattedTime = DateTime.Today.Add(dto.InterviewTime).ToString("hh:mm tt");

            // ================= CANDIDATE EMAIL =================
            try
            {
                await _emailService.SendEmailAsync(
                    application.Email,
                    "Interview Invitation - Pirnav",
                    $@"
<div style='background:#f4f6f8;padding:30px;font-family:Segoe UI'>

<div style='max-width:650px;margin:auto;background:#ffffff;border-radius:10px;
border:1px solid #e5e7eb'>

<div style='padding:25px;text-align:center;border-bottom:1px solid #e5e7eb'>
<img src='{logoUrl}' width='140' style='display:block;margin:auto;'/>
<h2 style='margin-top:15px;color:#111;font-weight:600'>Pirnav Careers</h2>
</div>

<div style='background:#0A66C2;color:#fff;padding:16px;text-align:center;font-weight:600'>
Interview Invitation
</div>

<div style='padding:25px;color:#333;line-height:1.7'>

<p>Dear <b>{formattedName}</b>,</p>

<p>
We are pleased to inform you that your application has progressed to the next stage.
You have been shortlisted for <b>{application.Job.JobTitle}</b>.
</p>

<div style='background:#f1f5f9;border-left:4px solid #0A66C2;
border-radius:8px;padding:16px;margin:20px 0'>

<p>📅 <b>Interview Date:</b> {formattedDate}</p>
<p>⏰ <b>Interview Time:</b> {formattedTime}</p>
<p>💻 <b>Mode:</b> {dto.Mode}</p>
<p>🔗 <b>Meeting Link:</b> <a href='{meetingLink}'>Click here</a></p>

</div>

<div style='text-align:center;margin-top:25px'>
<a href='{meetingLink}'
style='background:#0A66C2;color:white;padding:12px 26px;border-radius:6px;
text-decoration:none;font-weight:600;display:inline-block'>
Join Interview
</a>
</div>

<p style='margin-top:25px'>
Kindly ensure that you are available at the scheduled time.
</p>

<p style='margin-top:25px'>
Warm regards,<br/>
<b>Pirnav Recruitment Team</b>
</p>

</div>

<div style='text-align:center;padding:18px;background:#f9fafb;font-size:12px;color:#666'>
<b>Pirnav Software Solutions Pvt Ltd</b><br/>
India, USA, UK, Canada<br/>
Email: hr.admin@pirnav.com
</div>

</div>
</div>"
                );
            }
            catch { }


            // ================= INTERVIEWER EMAIL =================
            try
            {
                var baseUrl = "https://farrandly-interalar-talon.ngrok-free.dev";

                var feedbackLink = $"{baseUrl}/feedback.html?token={interview.FeedbackToken}";
                var resumeLink = $"{baseUrl}/api/JobApplications/view/{application.Id}";

                await _emailService.SendEmailAsync(
                    manager.Email,
                    "Interview Assignment Notification - Pirnav",
                    $@"
<div style='background:#f4f6f8;padding:30px;font-family:Segoe UI'>

<div style='max-width:650px;margin:auto;background:#ffffff;border-radius:10px;
border:1px solid #e5e7eb'>

<div style='padding:25px;text-align:center;border-bottom:1px solid #e5e7eb'>
<img src='https://pirnav.com/images/pirnav_logo.png'
width='140'
style='display:block;margin:auto;'/>
<h2 style='margin-top:15px;color:#111;font-weight:600'>Pirnav Careers</h2>
</div>

<div style='background:#0A66C2;color:#fff;padding:16px;text-align:center;font-weight:600'>
Interview Assignment Notification
</div>

<div style='padding:25px;color:#333;line-height:1.7'>

<p>Hello <b>{manager.Name}</b>,</p>

<p>
You have been assigned to conduct an interview. Please find the details below:
</p>

<p><b>Candidate:</b> {formattedName}</p>
<p><b>Position:</b> {application.Job.JobTitle}</p>

<p>📄 <b>Resume:</b> 
<a href='{resumeLink}' style='color:#0A66C2'>View Resume</a></p>

<p>📝 <b>Feedback:</b> 
<a href='{feedbackLink}' style='color:#0A66C2'>Submit Feedback</a></p>

<div style='background:#f1f5f9;border-left:4px solid #0A66C2;
border-radius:8px;padding:16px;margin:20px 0'>

<p>📅 <b>Date:</b> {formattedDate}</p>
<p>⏰ <b>Time:</b> {formattedTime}</p>
<p>💻 <b>Mode:</b> {dto.Mode}</p>

</div>

<div style='text-align:center;margin-top:25px'>
<a href='{meetingLink}' 
style='background:#0A66C2;color:white;padding:12px 26px;border-radius:6px;
text-decoration:none;font-weight:600;display:inline-block'>
Join Interview
</a>
</div>

<p style='margin-top:25px'>
Regards,<br/>
<b>Pirnav HR Team</b>
</p>

</div>

<div style='text-align:center;padding:18px;background:#f9fafb;font-size:12px;color:#666'>
<b>Pirnav Software Solutions Pvt Ltd</b><br/>
India, USA, UK, Canada<br/>
Email: hr.admin@pirnav.com
</div>

</div>
</div>"
                );
            }
            catch { }


            // ================= EMAIL LOGIC END =================

            return Ok(new { message = "Interview Scheduled Successfully" });
        }

        // ================= DETAILS =================
        [AllowAnonymous]
        [HttpGet("details/{id}")]
        public IActionResult GetInterviewDetails(int id)
        {
            var data = _context.Interviews
                .Where(i => i.Id == id && !i.IsDeleted) // ✅ filter added
                .Select(i => new
                {
                    candidateName = i.Application.Name,
                    jobTitle = i.Application.Job.JobTitle
                })
                .FirstOrDefault();

            if (data == null)
                return NotFound();

            return Ok(data);
        }

        // ================= TOKEN DETAILS =================
        [AllowAnonymous]
        [HttpGet("details-by-token")]
        public IActionResult GetDetailsByToken(string token)
        {
            var interview = _context.Interviews
                .Where(i => !i.IsDeleted) // ✅ filter added
                .Include(i => i.Application)
                .ThenInclude(a => a.Job)
                .FirstOrDefault(i => i.FeedbackToken == token);

            if (interview == null)
                return BadRequest(new { message = "Invalid token" });

            return Ok(new
            {
                candidateName = interview.Application.Name,
                jobTitle = interview.Application.Job.JobTitle
            });
        }

        // ================= UPDATE =================


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateInterviewDto dto)
        {
            var interview = await _context.Interviews
                .Include(i => i.Application).ThenInclude(a => a.Job)
                .Include(i => i.Manager)
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted); // filter 

            if (interview == null)
                return NotFound();

            interview.InterviewDate = dto.InterviewDate;
            interview.InterviewTime = dto.InterviewTime;
            interview.Mode = dto.Mode;
            interview.MeetingLink = dto.MeetingLink;
            interview.ManagerId = dto.ManagerId;

            await _context.SaveChangesAsync();

            
            var application = _context.JobApplications
                .FirstOrDefault(a => a.Id == interview.ApplicationId);

            
            var manager = _context.Managers
     .FirstOrDefault(m => m.Id == interview.ManagerId);

            // ================= RESCHEDULE EMAIL LOGIC =================

            var baseUrl = "https://farrandly-interalar-talon.ngrok-free.dev";

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

            string meetingLink = string.IsNullOrEmpty(interview.MeetingLink) ? "#" : interview.MeetingLink;

            string formattedDate = interview.InterviewDate.ToString("dddd, dd MMM yyyy");
            string formattedTime = DateTime.Today.Add(interview.InterviewTime).ToString("hh:mm tt");

            // ================= LINKS =================
            var feedbackLink = $"{baseUrl}/feedback.html?token={interview.FeedbackToken}";
            var resumeLink = $"{baseUrl}/api/JobApplications/view/{application.Id}";


            // ================= CANDIDATE EMAIL =================
            try
            {
                await _emailService.SendEmailAsync(
                    application.Email,
                    "Interview Rescheduled - Pirnav",
                    $@"
<div style='background:#f4f6f8;padding:30px;font-family:Segoe UI'>

<div style='max-width:650px;margin:auto;background:#ffffff;border-radius:10px;
border:1px solid #e5e7eb'>

{header}

<div style='background:#f59e0b;color:#fff;padding:16px;text-align:center;font-weight:600'>
Interview Rescheduled
</div>

<div style='padding:25px;color:#333;line-height:1.7'>

<p>Dear <b>{application.Name}</b>,</p>

<p>
Your interview has been <b>rescheduled</b>. Please find the updated details below:
</p>

<div style='background:#f1f5f9;border-left:4px solid #f59e0b;
border-radius:8px;padding:16px;margin:20px 0'>

<p>📅 <b>New Date:</b> {formattedDate}</p>
<p>⏰ <b>New Time:</b> {formattedTime}</p>
<p>💻 <b>Mode:</b> {interview.Mode}</p>
<p>🔗 <b>Meeting Link:</b> <a href='{meetingLink}'>Join Interview</a></p>

</div>

<div style='text-align:center;margin-top:25px'>
<a href='{meetingLink}'
style='background:#f59e0b;color:white;padding:12px 26px;border-radius:6px;
text-decoration:none;font-weight:600;display:inline-block'>
Join Interview
</a>
</div>

<p style='margin-top:25px'>
We apologize for any inconvenience caused.
</p>

<p style='margin-top:25px'>
Warm regards,<br/>
<b>Pirnav Recruitment Team</b>
</p>

</div>

{footer}

</div>
</div>"
                );
            }
            catch { }


            // ================= INTERVIEWER EMAIL =================
            try
            {
                await _emailService.SendEmailAsync(
                    manager.Email,
                    "Interview Rescheduled - Pirnav",
                    $@"
<div style='background:#f4f6f8;padding:30px;font-family:Segoe UI'>

<div style='max-width:650px;margin:auto;background:#ffffff;border-radius:10px;
border:1px solid #e5e7eb'>

{header}

<div style='background:#f59e0b;color:#fff;padding:16px;text-align:center;font-weight:600'>
Interview Rescheduled
</div>

<div style='padding:25px;color:#333;line-height:1.7'>

<p>Hello <b>{manager.Name}</b>,</p>

<p>
The interview has been <b>rescheduled</b>. Updated details:
</p>

<p><b>Candidate:</b> {application.Name}</p>
<p><b>Position:</b> {application.Job.JobTitle}</p>

<p>📄 <b>Resume:</b> 
<a href='{resumeLink}' style='color:#0A66C2'>View Resume</a></p>

<p>📝 <b>Feedback:</b> 
<a href='{feedbackLink}' style='color:#0A66C2'>Submit Feedback</a></p>

<div style='background:#f1f5f9;border-left:4px solid #f59e0b;
border-radius:8px;padding:16px;margin:20px 0'>

<p>📅 <b>New Date:</b> {formattedDate}</p>
<p>⏰ <b>New Time:</b> {formattedTime}</p>
<p>💻 <b>Mode:</b> {interview.Mode}</p>

</div>

<div style='text-align:center;margin-top:25px'>
<a href='{meetingLink}'
style='background:#f59e0b;color:white;padding:12px 26px;border-radius:6px;
text-decoration:none;font-weight:600;display:inline-block'>
Join Interview
</a>
</div>

<p style='margin-top:25px'>
Regards,<br/>
<b>Pirnav HR Team</b>
</p>

</div>

{footer}

</div>
</div>"
                );
            }
            catch { }

            // ================= END =================


            return Ok(new { message = "Interview Updated Successfully" });
        }

        // ================= DELETE (NEW) =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var interview = await _context.Interviews.FindAsync(id);

            if (interview == null || interview.IsDeleted)
                return NotFound(new { message = "Interview not found" });

            interview.IsDeleted = true; // ✅ Soft delete

            await _context.SaveChangesAsync();

            return Ok(new { message = "Interview deleted successfully" });
        }
    }
}