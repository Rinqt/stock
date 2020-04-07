using System;

namespace Stock.Domain.Entities.Interfaces
{
    /// <summary>
    /// Represents an object in the database.
    /// Provides the base validation shared across the domain.
    /// </summary>
    public interface IEntity
    {
        Guid Id { get; }

        DateTime CreatedAt { get; }

        /// <summary>
        /// Used internally for optimistic concurrency.
        /// </summary>
        Guid Version { get; }

        void Validate(IEntity entity);
    }
}
