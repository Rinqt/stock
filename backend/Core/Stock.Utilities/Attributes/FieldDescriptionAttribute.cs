using System;
using System.ComponentModel;

namespace Stock.Utilities.Attributes
{
    /// <summary>
    /// Should be used only on enum fields.
    /// </summary>
    [AttributeUsage(AttributeTargets.Field)]
    public class FieldDescriptionAttribute : DescriptionAttribute
    {
        public FieldDescriptionAttribute(string description)
            : base(description)
        {
        }
    }
}
