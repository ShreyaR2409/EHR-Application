using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Model.Appointment
{
    public class AddAppointmentDto
    {
        public int PatientId { get; set; }
        public int ProviderId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
        public string ChiefComplaint { get; set; }
        public float Fee { get; set; }
    }
}
