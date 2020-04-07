using System;
using AutoMapper;
using Stock.Api.Models.Dtos.Users;
using User = Stock.Domain.Entities.User;

namespace Stock.Api.Mappers
{
    public class RequestMapper : Profile
    {
        public RequestMapper()
        {
            CreateMap<Company, User.Company>();
            CreateMap<Company, User.SearchedCompany>().ForMember(
                c => c.SearchedAt, 
                o => o.MapFrom(co => DateTime.UtcNow)
            );
        }
    }
}
