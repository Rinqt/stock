using System;
using FuncSharp;

namespace Stock.Utilities.Helpers.Tests
{
    public abstract class Test
    {
        /// <summary>
        /// Method used to enforce AAA (arrange-act-assert) principle.
        /// </summary>
        /// <typeparam name="TArrangeResult">Result returned from arrange function.</typeparam>
        /// <typeparam name="TActResult">Result returned from act function.</typeparam>
        /// <param name="arrange">Preparing data to be used.</param>
        /// <param name="act">Performing operation on that data.</param>
        /// <param name="assert">Validating result of the operation.</param>
        protected static void UnitTest<TArrangeResult, TActResult>(Func<Unit, TArrangeResult> arrange, Func<TArrangeResult, TActResult> act, Action<TActResult> assert)
        {
            var arrangeResult = arrange(Unit.Value);
            var actResult = act(arrangeResult);
            assert(actResult);
        }

        /// <summary>
        /// Method used to enforce AAA (arrange-act-assert) principle.
        /// </summary>
        /// <typeparam name="TArrangeResult">Result returned from arrange function.</typeparam>
        /// <typeparam name="TActResult">Result returned from act function.</typeparam>
        /// <param name="arrange">Preparing data to be used.</param>
        /// <param name="act">Performing operation on that data.</param>
        /// <param name="assert">Validating result of the operation.</param>
        protected static void IntegrationTest<TArrangeResult, TActResult>(Func<Unit, TArrangeResult> arrange, Func<TArrangeResult, TActResult> act, Action<TActResult> assert)
        {
            var arrangeResult = arrange(Unit.Value);
            var actResult = act(arrangeResult);
            assert(actResult);
        }
    }
}
