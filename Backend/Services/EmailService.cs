using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace Pirnav.API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();

                message.From.Add(new MailboxAddress(
                    _configuration["EmailSettings:SenderName"],
                    _configuration["EmailSettings:SenderEmail"]
                ));

                message.To.Add(new MailboxAddress("", toEmail.Trim()));
                message.Subject = subject;

                message.Body = new TextPart("html")
                {
                    Text = body
                };

                using var client = new SmtpClient();

                //client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                await client.ConnectAsync(
                    _configuration["EmailSettings:SmtpServer"],
                    int.Parse(_configuration["EmailSettings:Port"]),
                    SecureSocketOptions.SslOnConnect
                );

                await client.AuthenticateAsync(
                    _configuration["EmailSettings:SenderEmail"],
                    _configuration["EmailSettings:Password"]
                );

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                Console.WriteLine($"Email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.Message}");
            }
        }

        public async Task SendEmailWithAttachmentAsync(
    string toEmail,
    string subject,
    string body,
    string filePath)
        {
            try
            {
                var message = new MimeMessage();

                message.From.Add(new MailboxAddress(
                    _configuration["EmailSettings:SenderName"],
                    _configuration["EmailSettings:SenderEmail"]
                ));

                message.To.Add(new MailboxAddress("", toEmail.Trim()));
                message.Subject = subject;

                var builder = new BodyBuilder
                {
                    HtmlBody = body
                };

                // ✅ Attach resume file
                if (System.IO.File.Exists(filePath))
                {
                    builder.Attachments.Add(filePath);
                }

                message.Body = builder.ToMessageBody();

                using var client = new SmtpClient();

                //client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                await client.ConnectAsync(
                    _configuration["EmailSettings:SmtpServer"],
                    int.Parse(_configuration["EmailSettings:Port"]),
                    SecureSocketOptions.SslOnConnect
                );

                await client.AuthenticateAsync(
                    _configuration["EmailSettings:SenderEmail"],
                    _configuration["EmailSettings:Password"]
                );

                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Attachment email failed: {ex.Message}");
            }
        }
    }
}