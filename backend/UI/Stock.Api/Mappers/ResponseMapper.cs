using AutoMapper;
using Stock.Api.Models.Dtos.Articles;
using Stock.Api.Models.Dtos.Companies;
using Stock.Api.Models.Dtos.Stocks;
using Stock.Api.Models.Dtos.Users;
using Stock.Application.Infrastructure.Components.MlModels.Dtos;
using Stock.Application.Infrastructure.Components.Users.Dtos;
using Stock.Domain.Entities;
using Stock.Utilities.Globalization;
using Stock.Utilities.Globalization.Keys;
using Company = Stock.Domain.Entities.Company;

namespace Stock.Api.Mappers
{
    public class ResponseMapper : Profile
    {
        public ResponseMapper()
        {
            CreateMap<Domain.Entities.User.Company, Models.Dtos.Users.Company>();
            CreateMap<Article, SimpleArticleResponse>();
            CreateMap<Company, CompanyResponse>();
            CreateMap<Article, ArticleResponse>();
            CreateMap<UsersInfo, UsersBasicInfo>();
            CreateMap<UsersSettings, UsersBasicSettings>();
            CreateMap<Application.Infrastructure.Components.Users.Dtos.UsersSearchHistory, Models.Dtos.Users.UsersSearchHistory>();
            CreateMap<Domain.Entities.Stock, SimpleStockResponse>();
            CreateMap<Domain.Entities.Stock, SimpleCompanyAgnosticStockResponse>();
            CreateMap<MlModel, Models.Dtos.MlModels.MlModel>()
                .ForMember(m => m.CompanySymbol, o =>
                    o.MapFrom(ml => ml.Parameters.CompanySymbol)
                );
            CreateMap<AddMlModelResponse, Models.Dtos.MlModels.AddMlModelResponse>()
                .ForMember(m => m.Message, o =>
                    o.MapFrom(ml => Localization.Get(Keys.ScheduledBuild, $"{ml.Delay.Minutes}"))
                );
        }
    }
}
