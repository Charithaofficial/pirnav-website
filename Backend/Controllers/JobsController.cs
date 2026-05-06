using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pirnav.API.DTOs;
using Pirnav.API.Models;

namespace Pirnav.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobsController(AppDbContext context)
        {
            _context = context;
        }

        // ================= ADMIN =================

        [Authorize(Roles = "Admin, SuperAdmin")]
        [HttpGet]
        public IActionResult GetAll()
        {
            var jobs = _context.Jobs
                .OrderByDescending(j => j.CreatedDate)
                .Select(j => new JobResponseDto
                {
                    Id = j.Id,
                    JobTitle = j.JobTitle ?? "",
                    WorkLocation = j.WorkLocation ?? "",
                    JobType = j.JobType ?? "",
                    Status = j.Status ?? "",
                    Experience = j.Experience ?? "",
                    CTC = j.CTC ?? "",
                    HighestQualification = j.HighestQualification ?? "",
                    JobDescription = j.JobDescription ?? "",
                    MandatorySkills = j.MandatorySkills ?? "",
                    CreatedDate = j.CreatedDate ?? DateTime.UtcNow
                })
                .ToList();

            return Ok(jobs);
        }





        [Authorize(Roles = "Admin, SuperAdmin")]
        [HttpPost]
        public IActionResult Create(JobCreateDto dto)
        {
            dto.CTC = dto.CTC?.ToUpper() ?? "";
            dto.Experience = dto.Experience?.ToLower() ?? "";

            var job = new Job
            {
                JobTitle = dto.JobTitle,
                WorkLocation = dto.WorkLocation,
                JobType = dto.JobType,
                Status = dto.Status,
                Experience = dto.Experience,
                CTC = dto.CTC,
                HighestQualification = dto.HighestQualification,
                JobDescription = dto.JobDescription,
                MandatorySkills = dto.MandatorySkills,
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            };

            _context.Jobs.Add(job);
            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                message = "Job created successfully"
            });
        }

        [Authorize(Roles = "Admin, SuperAdmin")]
        [HttpPut("{id}")]
        public IActionResult Update(int id, JobUpdateDto dto)
        {
            var job = _context.Jobs.FirstOrDefault(x => x.Id == id);

            if (job == null)
                return NotFound(new { message = "Job not found" });

            job.JobTitle = dto.JobTitle;
            job.WorkLocation = dto.WorkLocation;
            job.JobType = dto.JobType;
            job.Status = dto.Status;
            job.Experience = dto.Experience;
            job.CTC = dto.CTC;
            job.HighestQualification = dto.HighestQualification;
            job.JobDescription = dto.JobDescription;
            job.MandatorySkills = dto.MandatorySkills;

            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                message = "Job updated successfully"
            });
        }



        [Authorize(Roles = "Admin, SuperAdmin")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var job = _context.Jobs.Find(id);

            if (job == null)
                return NotFound(new { message = "Job not found" });

            _context.Jobs.Remove(job);
            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                message = "Job deleted successfully"
            });
        }

        // ================= PUBLIC =================

        [AllowAnonymous]
        [HttpGet("public")]
        public IActionResult GetPublicJobs()
        {
            var jobs = _context.Jobs
                .Where(x => x.Status == "open" && x.IsActive == true)
                .OrderByDescending(x => x.CreatedDate)
                .Select(j => new JobResponseDto
                {
                    Id = j.Id,
                    JobTitle = j.JobTitle ?? "",
                    WorkLocation = j.WorkLocation ?? "",
                    JobType = j.JobType ?? "",
                    Status = j.Status ?? "",
                    Experience = j.Experience ?? "",
                    CTC = j.CTC ?? "",
                    HighestQualification = j.HighestQualification ?? "",
                    JobDescription = j.JobDescription ?? "",
                    MandatorySkills = j.MandatorySkills ?? "",
                    CreatedDate = j.CreatedDate ?? DateTime.UtcNow
                })
                .ToList();

            return Ok(jobs);
        }




        [AllowAnonymous]
        [HttpGet("public/{id}")]
        public IActionResult GetPublicJobById(int id)
        {
            var job = _context.Jobs
                .Where(x => x.Id == id && x.Status == "open")
                .Select(j => new JobResponseDto
                {
                    Id = j.Id,
                    JobTitle = j.JobTitle ?? "",
                    WorkLocation = j.WorkLocation ?? "",
                    JobType = j.JobType ?? "",
                    Status = j.Status ?? "",
                    Experience = j.Experience ?? "",
                    CTC = j.CTC ?? "",
                    HighestQualification = j.HighestQualification ?? "",
                    JobDescription = j.JobDescription ?? "",
                    MandatorySkills = j.MandatorySkills ?? "",
                    CreatedDate = j.CreatedDate ?? DateTime.UtcNow
                })
                .FirstOrDefault();

            if (job == null)
                return NotFound(new { message = "Job not found" });

            return Ok(job);
        }
    }
}