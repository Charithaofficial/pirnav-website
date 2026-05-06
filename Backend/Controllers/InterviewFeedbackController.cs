using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pirnav.API.Models;
using Pirnav.API.Services;

[ApiController]
[Route("api/[controller]")]
public class InterviewFeedbackController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly EmsService _emsService;

    public InterviewFeedbackController(AppDbContext context, EmsService emsService)
    {
        _context = context;
        _emsService = emsService;
    }

    // === GET ALL (Admin)
    [HttpGet("all")]
    public IActionResult GetAllFeedbacks()
    {
        var data = (from f in _context.InterviewFeedbacks
                    where !f.IsDeleted 
                    join i in _context.Interviews on f.InterviewId equals i.Id
                    join a in _context.JobApplications on i.ApplicationId equals a.Id
                    join m in _context.Managers on i.ManagerId equals m.Id
                    select new
                    {
                        f.Id,
                        CandidateName = a.Name,
                        jobTitle = a.Job.JobTitle,
                        managerName = m.Name,
                        f.Rating,
                        f.Comments,
                        InterviewerStatus = f.Status,
                        AdminDecision = f.AdminDecision,
                        f.CreatedAt
                    }).ToList();

        return Ok(data);
    }

    // === ADMIN DECISION UPDATE
    [HttpPut("admin-decision/{id}")]
    public async Task<IActionResult> UpdateAdminDecision(int id, [FromBody] UpdateFeedbackStatusDto dto)
    {
        var feedback = _context.InterviewFeedbacks
            .FirstOrDefault(f => f.Id == id && !f.IsDeleted); 

        if (feedback == null)
            return NotFound(new { message = "Feedback not found" });

        if (string.IsNullOrWhiteSpace(dto.Status))
            return BadRequest(new { message = "Status is required" });

        feedback.AdminDecision = dto.Status.Trim();
        feedback.Status = dto.Status.Trim();

        _context.SaveChanges();

        if (dto.Status == "Selected")
        {
            Console.WriteLine("EMS TRIGGERED BY ADMIN");

            try
            {
                var application = _context.JobApplications
                    .FirstOrDefault(a => a.Id == feedback.CandidateId);

                if (application != null)
                {
                    await _emsService.SendToEms(application);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("EMS ERROR: " + ex.Message);
            }
        }

        return Ok(new { success = true, message = "Admin decision updated" });
    }

    // === SUBMIT FEEDBACK
    [AllowAnonymous]
    [HttpPost("submit")]
    public async Task<IActionResult> SubmitFeedback([FromQuery] string token, [FromBody] FeedbackDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token missing" });

            var interview = _context.Interviews
                .Where(i => !i.IsDeleted)
                .AsEnumerable()
                .FirstOrDefault(i => i.FeedbackToken != null && i.FeedbackToken.Trim() == token.Trim());

            if (interview == null)
                return BadRequest(new { message = "Invalid interview" });

            var existing = _context.InterviewFeedbacks
                .FirstOrDefault(f => f.InterviewId == interview.Id && !f.IsDeleted); 

            // UPDATE CASE
            if (existing != null)
            {
                existing.Rating = dto.Rating;
                existing.Comments = dto.Comments;
                existing.Status = dto.Status;
                existing.CreatedAt = DateTime.UtcNow;

                _context.SaveChanges();

                return Ok(new { success = true, message = "Feedback updated" });
            }

            if (string.IsNullOrWhiteSpace(dto.Comments))
                return BadRequest(new { message = "Comments are required" });

            var feedback = new InterviewFeedback
            {
                InterviewId = interview.Id,
                CandidateId = interview.ApplicationId,
                InterviewerId = interview.ManagerId,
                Rating = dto.Rating,
                Comments = dto.Comments,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow
            };

            _context.InterviewFeedbacks.Add(feedback);
            _context.SaveChanges();

            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    // === DELETE (NEW - SOFT DELETE)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var feedback = await _context.InterviewFeedbacks.FindAsync(id);

        if (feedback == null || feedback.IsDeleted)
            return NotFound(new { message = "Feedback not found" });

        feedback.IsDeleted = true; 

        await _context.SaveChangesAsync();

        return Ok(new { message = "Feedback deleted successfully" });
    }
}