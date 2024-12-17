using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Model.Appointment
{
    public class GetAppointmentDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int ProviderId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
        public string ChiefComplaint { get; set; }
        public string AppointmentStatus { get; set; }
        public float Fee { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
