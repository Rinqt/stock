namespace Stock.Application.Infrastructure.Jobs
{
    /// <summary>
    /// Base job interface.
    /// When creating job keep in mind that the methods that you invoke need to be public.
    /// </summary>
    public interface IJob
    {
        void Create();
    }
}
