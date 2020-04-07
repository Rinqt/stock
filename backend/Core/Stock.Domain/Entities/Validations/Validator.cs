using System.Collections.Generic;
using System.Linq;
using Stock.Domain.Entities.Interfaces;

namespace Stock.Domain.Entities.Validations
{
    public static class Validator
    {
        public static void Validate(this IEntity entity)
        {
            entity.Validate(entity);
        }

        public static void Validate(this IEnumerable<IEntity> entities)
        {
            entities.ToList().ForEach(e =>
            {
                e.Validate();
            });
        }
    }
}
