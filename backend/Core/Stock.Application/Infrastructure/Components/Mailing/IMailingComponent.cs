using System.Threading.Tasks;
using Stock.Application.Infrastructure.Components.Mailing.Dtos;

namespace Stock.Application.Infrastructure.Components.Mailing
{
    public interface IMailingComponent
    {
        Task SendAsync(SendMailParameters mailParameters);
    }
}
