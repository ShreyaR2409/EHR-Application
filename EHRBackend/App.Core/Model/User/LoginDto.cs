using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Model.User
{
    public class LoginDto
    {
        public required string UserName {get; set;}
        public required string Password {get; set;}
    }
}
