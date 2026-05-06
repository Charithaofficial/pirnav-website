using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pirnav.API.Models;

namespace Pirnav.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeadController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeadController(AppDbContext context)
        {
            _context = context;
        }

        // 🔥 GET all leads (for admin page)
        [HttpGet]
        public async Task<IActionResult> GetLeads()
        {
            var leads = await _context.Leads
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(leads);
        }


        //  update all leads (for admin page)

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLead(int id, [FromBody] Lead updatedLead)
        {
            var lead = await _context.Leads.FindAsync(id);

            if (lead == null)
                return NotFound();

            lead.Name = updatedLead.Name;
            lead.Email = updatedLead.Email;
            lead.Requirement = updatedLead.Requirement;

            await _context.SaveChangesAsync();

            return Ok(lead);
        }


        // delete all leads (for admin page)

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLead(int id)
        {
            var lead = await _context.Leads.FindAsync(id);

            if (lead == null)
                return NotFound();

            _context.Leads.Remove(lead);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Lead deleted successfully" });
        }


        //export all leads for admin side

        [HttpGet("export")]
        public IActionResult ExportLeads()
        {
            var leads = _context.Leads.ToList();

            var csv = "Name,Email,Requirement,CreatedAt\n";

            foreach (var lead in leads)
            {
                csv += $"{lead.Name},{lead.Email},{lead.Requirement},{lead.CreatedAt}\n";
            }

            var bytes = System.Text.Encoding.UTF8.GetBytes(csv);

            return File(bytes, "text/csv", "leads.csv");
        }
    }
}