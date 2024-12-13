using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Users
{
    public class BloodGroup
    {
        public int BloodGroupId { get; set; }
        public required string BloodGroupName { get; set; }
    }
}
