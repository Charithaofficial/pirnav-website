using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Pirnav.API.Helpers;
using Pirnav.API.Models;
using Pirnav.API.Services;
using System.Globalization;
using Microsoft.AspNetCore.RateLimiting;

namespace Pirnav.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;

        public ContactController(AppDbContext context, EmailService emailService, IConfiguration config)
        {
            _context = context;
            _emailService = emailService;
            _config = config;
        }

        // ================= SEND MESSAGE =================

        [EnableRateLimiting("contactLimiter")]
        [HttpPost]
        public async Task<IActionResult> SendMessage(ContactMessage model)
        {

            if (EmailHelper.IsBlockedDomain(model.Email))
            {
                return BadRequest(new { message = "Temporary email addresses are not allowed." });
            }

            if (EmailHelper.IsSpamContent(model.Subject) ||
    EmailHelper.IsSpamContent(model.Message))
            {
                return BadRequest(new { message = "Spam content detected." });
            }

            model.CreatedDate = DateTime.UtcNow;
            model.Status = "Unread";

            _context.ContactMessages.Add(model);
            await _context.SaveChangesAsync();

            var formattedName = string.IsNullOrWhiteSpace(model.Name)
    ? "User"
    : CultureInfo.CurrentCulture.TextInfo.ToTitleCase(model.Name.ToLower());

            var logoUrl = "https://pirnav.com/images/pirnav_logo.png";

            // ================= COMMON HEADER =================
            var header = $@"
<div style='padding:25px;text-align:center;background:#ffffff;border-bottom:1px solid #e5e7eb'>
<img src='{logoUrl}' width='140' style='display:block;margin:auto;'/>
<h2 style='margin-top:15px;color:#111;font-weight:600'>Pirnav Careers</h2>
</div>";

            // ================= COMMON FOOTER =================
            var footer = @"
<div style='text-align:center;padding:18px;background:#eef2f7;
font-size:12px;color:#555;line-height:1.6'>
<b>Pirnav Software Solutions Pvt Ltd</b><br/>
India, USA, UK, Canada<br/>
Email: hr.admin@pirnav.com
</div>";

            // ================= HR EMAIL =================
            var hrSubject = $"New Contact Enquiry | {model.Subject ?? "No Subject"}";

            var hrBody = $@"
<div style='font-family:Segoe UI,Arial;background:#f4f6f8;padding:30px'>
<div style='max-width:650px;margin:auto;background:#fff;border-radius:10px;border:1px solid #e5e7eb;
box-shadow:0 2px 8px rgba(0,0,0,0.08);'>

{header}

<div style='background:#0A66C2;color:#fff;padding:15px;text-align:center;font-weight:600'>
New Contact Enquiry
</div>

<div style='padding:25px;color:#333;font-size:14px;line-height:1.6'>

<p>Hello Team,</p>

<p>A new enquiry has been received from the Pirnav website.</p>

<table style='width:100%;border-collapse:collapse;margin-top:15px'>
<tr><td style='padding:10px;font-weight:bold;background:#f9fafb'>Name</td><td style='padding:10px;background:#f1f5f9'>{formattedName}</td></tr>
<tr><td style='padding:10px;font-weight:bold;background:#f9fafb'>Email</td><td style='padding:10px;background:#f1f5f9'>{model.Email}</td></tr>
<tr><td style='padding:10px;font-weight:bold;background:#f9fafb'>Subject</td><td style='padding:10px;background:#f1f5f9'>{model.Subject}</td></tr>
<tr><td style='padding:10px;font-weight:bold;background:#f9fafb'>Message</td><td style='padding:10px;background:#f1f5f9'>{System.Net.WebUtility.HtmlEncode(model.Message)}</td></tr>
</table>

<p style='margin-top:20px'>
Please review and respond at the earliest convenience.
</p>

<p style='margin-top:25px'>
Regards,<br/>
<b>Pirnav Recruitment System</b>
</p>

</div>

<div style='border-top:1px solid #e5e7eb'></div>

{footer}

</div>
</div>";

            var hrEmail = _config["EmailSettings:HrEmail"];
            if (!string.IsNullOrEmpty(hrEmail))
            {
                await _emailService.SendEmailAsync(hrEmail, hrSubject, hrBody);
            }

            // ================= USER EMAIL =================
            var userSubject = "Thank you for contacting Pirnav";

            var userBody = $@"
<div style='background:#f4f6f8;padding:30px;font-family:Segoe UI,Arial'>
<div style='max-width:650px;margin:auto;background:#fff;border-radius:10px;border:1px solid #e5e7eb'>

{header}

<div style='background:#0A66C2;color:#fff;text-align:center;padding:15px;font-weight:600'>
Thank You for Reaching Out
</div>

<div style='padding:25px;color:#333;font-size:15px;line-height:1.6'>

<p>Dear <b>{formattedName}</b>,</p>

<p>
Thank you for contacting <b>Pirnav Software Solutions Pvt Ltd</b>.
We have successfully received your enquiry regarding <b>{model.Subject}</b>.
</p>

<p>
Our team will review your message and respond within <b>24–48 business hours</b>.
</p>

<div style='background:#f1f5f9;border-left:4px solid #0A66C2;padding:12px;margin:20px 0;border-radius:5px'>
<b>Your Message:</b><br/>
{System.Net.WebUtility.HtmlEncode(model.Message)}
</div>

<div style='text-align:center;margin-top:25px'>
<a href='https://pirnav.com/careers'
style='background:#0A66C2;color:white;padding:12px 25px;
text-decoration:none;border-radius:6px;font-weight:600;display:inline-block'>
Explore Careers
</a>
</div>

<p style='margin-top:25px'>
Warm regards,<br/>
<b>Pirnav Team</b>
</p>

</div>

<div style='border-top:1px solid #e5e7eb'></div>

{footer}

</div>
</div>";

            if (!string.IsNullOrEmpty(model.Email))
            {
                await _emailService.SendEmailAsync(model.Email, userSubject, userBody);
            }

            return Ok(new
            {
                success = true,
                message = "Message sent successfully"
            });
        }

        // ================= ADMIN METHODS (UNCHANGED) =================

        [Authorize(Roles = "Admin, SuperAdmin")]
        [HttpGet]
        public IActionResult GetAllMessages(string? search)
        {
            var query = _context.ContactMessages.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x =>
                    x.Name.Contains(search) ||
                    x.Email.Contains(search) ||
                    x.Subject.Contains(search));
            }

            var messages = query
                .OrderByDescending(x => x.CreatedDate)
                .ToList();

            return Ok(messages);
        }

        [Authorize(Roles = "Admin, SuperAdmin")]
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var message = _context.ContactMessages.Find(id);

            if (message == null)
                return NotFound(new { message = "Message not found" });

            return Ok(message);
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPut("mark-read/{id}")]
        public IActionResult MarkAsRead(int id)
        {
            var message = _context.ContactMessages.Find(id);

            if (message == null)
                return NotFound(new { message = "Message not found" });

            if (message.Status == "Unread")
            {
                message.Status = "Read";
                _context.SaveChanges();
            }

            return Ok(new
            {
                success = true,
                message = "Marked as read"
            });
        }

        [Authorize(Roles = "Admin, SuperAdmin")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var message = _context.ContactMessages.Find(id);

            if (message == null)
                return NotFound(new { message = "Message not found" });

            _context.ContactMessages.Remove(message);
            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                message = "Deleted successfully"
            });
        }

        [Authorize(Roles = "Admin, SuperAdmin")]
        [HttpGet("unread-count")]
        public IActionResult GetUnreadCount()
        {
            var count = _context.ContactMessages
                .Count(x => x.Status == "Unread");

            return Ok(new { unread = count });
        }
    }
}