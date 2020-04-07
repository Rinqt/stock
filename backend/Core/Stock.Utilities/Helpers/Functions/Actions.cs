using System;
using System.Threading.Tasks;
using FuncSharp;

namespace Stock.Utilities.Helpers.Functions
{
    public static class Actions
    {
        public static ITry<TResult> TryAction<TResult, TException>(Func<Unit, TResult> action) where TException : Exception
        {
            return Try.Create<TResult, TException>(_ => action(Unit.Value));
        }

        public static async Task<ITry<TResult>> TryActionAsync<TResult>(Func<Unit, Task<TResult>> action)
        {
            try
            {
                return Try.Success(await action(Unit.Value));
            }
            catch (Exception e)
            {
                return Try.Error<TResult>(e);
            }
        }

        public static async Task<(TResult Value, bool Throws)> Throws<TResult, TException>(Func<Unit, Task<TResult>> action) where TException : Exception
        {
            try
            {
                var result = await action(Unit.Value);

                return (result, false);
            }
            catch (TException)
            {
                return (default, true);
            }
        }
    }
}
