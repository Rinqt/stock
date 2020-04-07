using System.ComponentModel.DataAnnotations;

namespace Stock.Api.Models.Dtos.MlModels
{
    public class AddModelRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        public object Parameters { get; set; }
    }
}
