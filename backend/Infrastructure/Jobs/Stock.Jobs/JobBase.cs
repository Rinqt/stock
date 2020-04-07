using System;
using System.Linq;
using FuncSharp;
using MongoDB.Driver;
using Stock.Application.Exceptions;
using Stock.Application.Infrastructure.Components.Business;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;
using Stock.Utilities.Extensions;
using static Stock.Utilities.Helpers.Functions.Actions;

namespace Stock.Jobs
{
    public abstract class JobBase
    {
        private readonly ITransaction _transaction;

        protected JobBase(ITransaction transaction)
        {
            _transaction = transaction;
        }

        protected void Transaction(Action<IBusinessContext, IClientSessionHandle> action)
        {
            var result = _transaction.TryTransaction(s => action(_transaction.BusinessContext, s));

            result.Get(e => e.First());
        }

        protected TResult Transaction<TResult>(Func<IBusinessContext, IClientSessionHandle, TResult> action)
        {
            var result = _transaction.TryTransaction(s => action(_transaction.BusinessContext, s));

            return result.Get(e => e.First());
        }

        protected TResult Transaction<TResult>(Func<IClientSessionHandle, TResult> action)
        {
            var result = _transaction.TryTransaction(action);

            return result.Get(e => e.First());
        }

        protected void Action(Action<IBusinessContext> action)
        {
            var result = TryAction<Unit, BusinessException>(_ =>
            {
                action(_transaction.BusinessContext);
                return Unit.Value;
            });
            result.Match(
                _ => { },
                e =>
                {
                    var exceptions = e.ToList();
                    exceptions.First().GetType().Match(
                        typeof(BusinessException), _ =>
                        {
                            var businessException = (BusinessException) exceptions.First();
                            if (businessException.ErrorType.SafeNotEquals(BusinessErrorType.ItemNotExists))
                            {
                                throw businessException;
                            }
                        },
                        _ => throw exceptions.First()
                    );
                }
            );
        }

        protected TResult Action<TResult>(Func<IBusinessContext, TResult> action)
        {
            return action(_transaction.BusinessContext);
        }
    }
}
