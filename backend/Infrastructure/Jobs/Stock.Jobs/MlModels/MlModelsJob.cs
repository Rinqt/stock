using System;
using System.Linq;
using FuncSharp;
using Hangfire;
using Stock.Application.Infrastructure.Components.Mailing.Dtos;
using Stock.Application.Infrastructure.Components.Users.Dtos;
using Stock.Application.Infrastructure.Jobs.MlModels;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;
using Stock.Domain.Entities;
using Stock.Domain.Entities.MlModelParameters;
using Stock.Utilities.Exceptions;
using Stock.Utilities.Extensions;
using Stock.Utilities.Globalization;
using Stock.Utilities.Globalization.Keys;

namespace Stock.Jobs.MlModels
{
    public class MlModelsJob : JobBase, IMlModelsJob
    {
        public MlModelsJob(ITransaction transaction)
            : base(transaction)
        {
        }

        public void Create()
        {
            var companies = Transaction((c, s) => c.Companies.GetManyAsync(s).GetAwaiter().GetResult());
            var models = companies.Select(c =>
                MlModel.TryCreate(c.Name, MlModelType.Default.GetDescription(), Guid.NewGuid(), new BaseParameters
                {
                    CompanySymbol = c.Symbol
                }).Get(_ => throw new InternalException(InternalErrorType.IncorrectBehavior, "Default model not created properly."))
            ).ToList();
            Transaction((c, s) => c.MlModels.AddDefaultModelsAsync(s, models).GetAwaiter().GetResult());
            RecurringJob.AddOrUpdate(() => BuildDefaultModels(), Cron.Daily(0));
        }

        public void BuildDefaultModels()
        {
            var models = Transaction((c, s) => c.MlModels.GetDefaultModelsAsync(s).GetAwaiter().GetResult());
            foreach (var model in models)
            {
                var buildResult = Action(c => c.MlModels.BuildModelAsync(model.Type, model.Parameters).GetAwaiter().GetResult());
                Transaction((c, s) => c.MlModels.UpdateAsync(s, model.Id, buildResult).GetAwaiter().GetResult());
            }
        }

        public void Create(Guid id, TimeSpan delay, string username)
        {
            BackgroundJob.Schedule(() => BuildModel(id, username), delay);
        }

        public void BuildModel(Guid id, string username)
        {
            Action(c =>
            {
                var model = Transaction(s => c.MlModels.GetAsync(s, id).GetAwaiter().GetResult());
                var buildResult = c.MlModels.BuildModelAsync(model.Type, model.Parameters).GetAwaiter().GetResult();

                c.Mailing.SendAsync(Transaction(s =>
                {
                    c.MlModels.UpdateAsync(s, id, buildResult).GetAwaiter().GetResult();
                    var user = c.Users.GetAsync<UsersInfo>(s, username).GetAwaiter().GetResult().UsersInfo.Get(_ =>
                        throw new InternalException(InternalErrorType.IncorrectBehavior, Localization.Get(Keys.InvalidCoproduct))
                    );
                    var email = c.Auth.GetUsersEmailAsync(username).GetAwaiter().GetResult();
                    
                    return new SendMailParameters
                    {
                        Subject = "Model build result",
                        ReceiverAddress = email,
                        ReceiverName = $"{user.FirstName} {user.LastName}",
                        Body = buildResult.IsSuccess.Match(t => $"Model: {model.Name} built successfully.", _ => $"Failed to build model: {model.Name}.")
                    };
                })).GetAwaiter().GetResult();
            });
        }
    }
}
