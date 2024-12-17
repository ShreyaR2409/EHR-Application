using App.Core.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Command
{
    public class CancelAppointmenCommand : IRequest<object>
    {
        public int AppointmentId { get; set; }
    }
    public class CancleAppointmentCommandHandler : IRequestHandler<CancelAppointmenCommand, object>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailService _emailService;
        public CancleAppointmentCommandHandler(IAppDbContext appDbContext, IEmailService emailService)
        {
            _appDbContext = appDbContext;
            _emailService = emailService;
        }
        public async Task<object> Handle(CancelAppointmenCommand command, CancellationToken cancellationToken)
        {
            var appointment = await _appDbContext.Set<Domain.Entities.Appointments.Appointment>()
                .FirstOrDefaultAsync(a => a.Id == command.AppointmentId, cancellationToken);

            if (appointment == null)
            {
                return new
                {
                    status = 404,
                    message = "Appointment Not Found"
                };
            }

            if (appointment.AppointmentStatus == "Cancelled")
            {
                return new
                {
                    status = 400,
                    message = "Appointment is already marked as Cancelled"
                };
            }

            // Mark as completed
            appointment.AppointmentStatus = "Cancelled";

            _appDbContext.Set<Domain.Entities.Appointments.Appointment>().Update(appointment);
            await _appDbContext.SaveChangesAsync(cancellationToken);
            string subject = "Appointment Cancelled";
            string patientBody = $"Your appointment is Cancelled for {appointment.AppointmentDate.ToShortDateString()} at {appointment.AppointmentTime} with Dr. {appointment.Provider.FirstName}.";
            string providerBody = $"Your appointment is Cancelled for {appointment.Patient.FirstName} on {appointment.AppointmentDate.ToShortDateString()} at {appointment.AppointmentTime}.";


            return new
            {
                status = 200,
                message = "Appointment marked as Cancelled"
            };
        }
    }
}
