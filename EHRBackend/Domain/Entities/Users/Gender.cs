using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Users
{
    public class Gender
    {
        public int GenderId { get; set; }
        public required string GenderName { get; set; }
    }
}
