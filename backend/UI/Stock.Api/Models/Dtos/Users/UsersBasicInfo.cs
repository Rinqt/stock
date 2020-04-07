using Stock.Application.Infrastructure.Components.Interfaces;

namespace Stock.Api.Models.Dtos.Users
{
    public class UsersBasicInfo : IMappable
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }
    }
}
