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

        private string GetRequiredSetting(string key)
        {
            var value = _configuration[key];

            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException($"Missing email configuration: {key}");
            }

            return value.Trim().Trim('"');
        }

        private SecureSocketOptions GetSecureSocketOptions(int port)
        {
            var configured = _configuration["EmailSettings:SecureSocketOptions"]?.Trim();

            if (Enum.TryParse<SecureSocketOptions>(configured, ignoreCase: true, out var option))
            {
                return option;
            }

            return port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            if (string.IsNullOrWhiteSpace(toEmail))
            {
                throw new ArgumentException("Recipient email is required.", nameof(toEmail));
            }

            _ = new System.Net.Mail.MailAddress(toEmail.Trim());

            var senderName = GetRequiredSetting("EmailSettings:SenderName");
            var senderEmail = GetRequiredSetting("EmailSettings:SenderEmail");
            var password = GetRequiredSetting("EmailSettings:Password");
            var smtpServer = GetRequiredSetting("EmailSettings:SmtpServer");
            var port = int.Parse(GetRequiredSetting("EmailSettings:Port"));

            var message = new MimeMessage();

            message.From.Add(new MailboxAddress(senderName, senderEmail));

            message.To.Add(new MailboxAddress("", toEmail.Trim()));
            message.Subject = subject;

            message.Body = new TextPart("html")
            {
                Text = body
            };

            using var client = new SmtpClient();

            client.CheckCertificateRevocation = false;

            await client.ConnectAsync(
                smtpServer,
                port,
                GetSecureSocketOptions(port)
            );

            await client.AuthenticateAsync(senderEmail, password);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            Console.WriteLine($"Email sent successfully to {toEmail}");
        }

        public async Task SendEmailWithAttachmentAsync(
    string toEmail,
    string subject,
    string body,
    string filePath)
        {
            if (string.IsNullOrWhiteSpace(toEmail))
            {
                throw new ArgumentException("Recipient email is required.", nameof(toEmail));
            }

            _ = new System.Net.Mail.MailAddress(toEmail.Trim());

            var senderName = GetRequiredSetting("EmailSettings:SenderName");
            var senderEmail = GetRequiredSetting("EmailSettings:SenderEmail");
            var password = GetRequiredSetting("EmailSettings:Password");
            var smtpServer = GetRequiredSetting("EmailSettings:SmtpServer");
            var port = int.Parse(GetRequiredSetting("EmailSettings:Port"));

            var message = new MimeMessage();

            message.From.Add(new MailboxAddress(senderName, senderEmail));

            message.To.Add(new MailboxAddress("", toEmail.Trim()));
            message.Subject = subject;

            var builder = new BodyBuilder
            {
                HtmlBody = body
            };

            if (System.IO.File.Exists(filePath))
            {
                builder.Attachments.Add(filePath);
            }

            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();

            client.CheckCertificateRevocation = false;

            await client.ConnectAsync(
                smtpServer,
                port,
                GetSecureSocketOptions(port)
            );

            await client.AuthenticateAsync(senderEmail, password);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
