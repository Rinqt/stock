using System;
using System.Threading.Tasks;
using FuncSharp;
using MongoDB.Driver;
using Stock.Application.Infrastructure.Components.Business;

namespace Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions
{
    public interface ITransaction
    {
        IBusinessContext BusinessContext { get; }

        /// <summary>
        /// Provides ACID (Atomicity, Consistency, Isolation, Durability) properties for database operations in a lifetime of a single transaction.
        /// Returns ITry of TActionResult. If successful, ITry contains the result of the operation/s. Otherwise, ITry contains errors happened during the operation/s.
        /// Wrap all database related asynchronous operation/s with this action when you expect result.
        /// </summary>
        /// <typeparam name="TTransactionResult"></typeparam>
        /// <param name="action"></param>
        /// <returns></returns>
        Task<ITry<TTransactionResult>> TryTransactionAsync<TTransactionResult>(Func<IClientSessionHandle, Task<TTransactionResult>> action);

        /// <summary>
        /// Provides ACID (Atomicity, Consistency, Isolation, Durability) properties for database operations in a lifetime of a single transaction.
        /// Returns ITry of TActionResult. If successful, ITry contains the result of the operation/s. Otherwise, ITry contains errors happened during the operation/s.
        /// Wrap all database related synchronous operation/s with this action when you expect result.
        /// </summary>
        /// <typeparam name="TTransactionResult"></typeparam>
        /// <param name="action"></param>
        /// <returns></returns>
        ITry<TTransactionResult> TryTransaction<TTransactionResult>(Func<IClientSessionHandle, TTransactionResult> action);

        /// <summary>
        /// Provides ACID (Atomicity, Consistency, Isolation, Durability) properties for database operations in a lifetime of a single transaction.
        /// Returns ITry of Unit. If successful, ITry contains the unit. Otherwise, ITry contains errors happened during the operation/s.
        /// Wrap all database related synchronous operation/s with this action when you don't expect any result.
        /// </summary>
        /// <param name="action"></param>
        /// <returns></returns>
        ITry<Unit> TryTransaction(Action<IClientSessionHandle> action);
    }
}
