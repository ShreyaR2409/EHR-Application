using Domain.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface IJwtService
    {
        string GenerateToken(User user, string roleType);

    }
}
