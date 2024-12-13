using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Common
{
    public class Country
    {
        public int CountryId { get; set; }
        public required string CountryName { get; set; }

    }
}
