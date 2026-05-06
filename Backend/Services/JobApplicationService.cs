using Microsoft.EntityFrameworkCore;
using Pirnav.API.Models;

namespace Pirnav.API.Services
{
    public class JobApplicationService
    {
        private readonly AppDbContext _context;

        public JobApplicationService(AppDbContext context)
        {
            _context = context;
        }

        // ADD APPLICATION
        public async Task AddApplication(JobApplication application)
        {
            try
            {
                _context.JobApplications.Add(application);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.InnerException?.Message ?? ex.Message);
            }
        }

        // GET APPLICATION BY ID
        public async Task<JobApplication?> GetById(int id)
        {
            return await _context.JobApplications
                .Include(x => x.Job)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        // DELETE APPLICATION
        public async Task DeleteApplication(int id)
        {
            var application = await _context.JobApplications.FindAsync(id);

            if (application == null)
                return;

            _context.JobApplications.Remove(application);
            await _context.SaveChangesAsync();
        }
    }
}