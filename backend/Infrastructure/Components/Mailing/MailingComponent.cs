using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using Stock.Application.Infrastructure.Components.Mailing;
using Stock.Application.Infrastructure.Components.Mailing.Dtos;

namespace Stock.Components.Mailing
{
    public class MailingComponent : IMailingComponent
    {
        private readonly Configuration.Mailing _mailing;

        public MailingComponent(IOptions<Configuration.Mailing> mailing)
        {
            _mailing = mailing.Value;
        }

        public async Task SendAsync(SendMailParameters mailParameters)
        {
            using var client = new SmtpClient
            {
                ServerCertificateValidationCallback = (s, c, h, e) => true
            };
            client.Connect(_mailing.Server, _mailing.Port, false);
            client.Authenticate(_mailing.Username, _mailing.Password);
            await client.SendAsync(CreateMail(mailParameters));
            client.Disconnect(true);
        }

        private MimeMessage CreateMail(SendMailParameters mailParameters)
        {
            var message = new MimeMessage
            {
                Subject = mailParameters.Subject,
                Body = new TextPart("plain")
                {
                    Text = mailParameters.Body
                },
                Importance = MessageImportance.High,
                Priority = MessagePriority.Urgent,
                XPriority = XMessagePriority.Highest,
                From = { new MailboxAddress(_mailing.Name, _mailing.Email) },
                To = { new MailboxAddress(mailParameters.ReceiverName, mailParameters.ReceiverAddress) }
            };

            return message;
        }
    }
}
