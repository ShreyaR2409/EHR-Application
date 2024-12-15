using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Command
{
    public class CancelAppointmenCommand : IRequest<object>
    {
        public int appointmentId { get; set; }
    }
    //public class CancleAppointmentCommand : IRequest<CancelAppointmenCommand, object>
    //{

    //}
}
