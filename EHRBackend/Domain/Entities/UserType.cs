﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class UserType
    {
        public int UserTypeId { get; set; }
        public required string UserTypeName { get; set; }
    }
}
