using Pirnav.API.Security;

namespace Pirnav.API.Services
{
    public class FileUploadService
    {
        private readonly IWebHostEnvironment _environment;

        public FileUploadService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string?> UploadResumeAsync(IFormFile file)
        {
            if (file == null)
                return null;

            var extension = Path.GetExtension(file.FileName).ToLower();

            var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };

            if (!allowedExtensions.Contains(extension))
                return null;

            if (file.Length > 5 * 1024 * 1024)
                return null;

            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? "wwwroot", "resumes");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            if (!FileSecurity.IsValidResume(memoryStream.ToArray()))
                return null;

            memoryStream.Position = 0;

            using var fileStream = new FileStream(filePath, FileMode.Create);
            await memoryStream.CopyToAsync(fileStream);

            return "/resumes/" + fileName;
        }
    }
}