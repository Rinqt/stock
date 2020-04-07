using System;
using System.Threading.Tasks;
using FuncSharp;
using MongoDB.Driver;
using Stock.Application.Infrastructure.Components.Business;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;
using Stock.Application.Infrastructure.Persistence.UnitOfWork;

namespace Stock.Persistence.UnitOfWork.Transactions
{
    public class Transaction : ITransaction
    {
        public IBusinessContext BusinessContext { get; }

        private readonly IDbContext _context;

        public Transaction(IBusinessContext businessContext, IDbContext dbContext)
        {
            BusinessContext = businessContext;
            _context = dbContext;
        }

        public async Task<ITry<TTransactionResult>> TryTransactionAsync<TTransactionResult>(Func<IClientSessionHandle, Task<TTransactionResult>> action)
        {
            using var session = await _context.Client.StartSessionAsync();
            try
            {
                session.StartTransaction();
                var actionResult = await action(session);
                await session.CommitTransactionAsync();
                
                return Try.Success(actionResult);
            }
            catch (Exception e)
            {
                await session.AbortTransactionAsync();
                
                return Try.Error<TTransactionResult>(e);
            }
        }

        public ITry<TTransactionResult> TryTransaction<TTransactionResult>(Func<IClientSessionHandle, TTransactionResult> action)
        {
            using var session = _context.Client.StartSession();
            try
            {
                session.StartTransaction();
                var result = action(session);
                session.CommitTransaction();

                return Try.Success(result);
            }
            catch (Exception e)
            {
                session.AbortTransaction();
                return Try.Error<TTransactionResult>(e);
            }
        }

        public ITry<Unit> TryTransaction(Action<IClientSessionHandle> action)
        {
            using var session = _context.Client.StartSession();
            try
            {
                session.StartTransaction();
                action(session);
                session.CommitTransaction();

                return Try.Success(Unit.Value);
            }
            catch (Exception e)
            {
                session.AbortTransaction();
                return Try.Error<Unit>(e);
            }
        }
    }
}
