using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Specialisation
    {
        public int SpecialisationId { get; set; }
        public required string SpecialisationName { get; set; }
    }
}
