using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities.Users;

namespace Domain.Entities.Common
{
    public class Otp
    {
        public int OtpId { get; set; }
        public required string LatestOtp { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
