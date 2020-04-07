namespace Stock.Application.Infrastructure.Components.Mailing.Dtos
{
    public class SendMailParameters
    {
        public string ReceiverAddress { get; set; }

        public string ReceiverName { get; set; }

        public string Subject { get; set; }

        public string Body { get; set; }
    }
}
