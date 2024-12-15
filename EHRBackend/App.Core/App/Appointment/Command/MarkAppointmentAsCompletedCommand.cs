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
    public class MarkAppointmentAsCompletedCommand : IRequest<object>
    {
        public int AppointmentId { get; set; }

    }
    public class MarkAppointmentAsCompletedCommandHandler : IRequestHandler<MarkAppointmentAsCompletedCommand, object>
    {
        private readonly IAppDbContext _appDbContext;

        public MarkAppointmentAsCompletedCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<object> Handle(MarkAppointmentAsCompletedCommand command, CancellationToken cancellationToken)
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

            if (appointment.AppointmentStatus == "Completed")
            {
                return new
                {
                    status = 400,
                    message = "Appointment is already marked as Completed"
                };
            }

            // Mark as completed
            appointment.AppointmentStatus = "Completed";

            _appDbContext.Set<Domain.Entities.Appointments.Appointment>().Update(appointment);
            await _appDbContext.SaveChangesAsync(cancellationToken);

            return new
            {
                status = 200,
                message = "Appointment marked as Completed"
            };
        }
    }
}
