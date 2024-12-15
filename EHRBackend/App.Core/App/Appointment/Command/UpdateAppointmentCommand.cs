using App.Core.Interface;
using App.Core.Model.Appointment;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Command
{
    public class UpdateAppointmentCommand : IRequest<object>
    {
        public UpdateAppointmentDto Appointment { get; set; }
    }

    public class UpdateAppointmentCommandHandler : IRequestHandler<UpdateAppointmentCommand, object>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailService _emailService;


        public UpdateAppointmentCommandHandler(IAppDbContext appDbContext, IEmailService emailService)
        {
            _appDbContext = appDbContext;
            _emailService = emailService;
        }

        public async Task<object> Handle(UpdateAppointmentCommand command, CancellationToken cancellationToken)
        {
            var dto = command.Appointment;

            // Fetch the appointment with related entities
            var appointment = await _appDbContext.Set<Domain.Entities.Appointments.Appointment>()
                .Include(a => a.Provider) // Include Provider details
                .Include(a => a.Patient)  // Include Patient details
                .FirstOrDefaultAsync(a => a.Id == dto.AppointmentId, cancellationToken);

            if (appointment == null)
            {
                return new
                {
                    status = 404,
                    message = "Appointment Not Found"
                };
            }

            // Check if the appointment can be edited
            if (appointment.AppointmentStatus == "Completed" || appointment.AppointmentDate < DateTime.UtcNow.Date)
            {
                return new
                {
                    status = 400,
                    message = "Cannot Edit Completed or Past Appointments"
                };
            }

            // Update appointment details
            appointment.AppointmentDate = dto.AppointmentDate;
            appointment.AppointmentTime = dto.AppointmentTime;
            appointment.ChiefComplaint = dto.ChiefComplaint;

            _appDbContext.Set<Domain.Entities.Appointments.Appointment>().Update(appointment);
            await _appDbContext.SaveChangesAsync(cancellationToken);

            // Prepare email notifications
            string subject = "Appointment Rescheduled";
            string patientBody = $"Your appointment is scheduled for {appointment.AppointmentDate.ToShortDateString()} at {appointment.AppointmentTime} with Dr. {appointment.Provider.FirstName}.";
            string providerBody = $"You have a new appointment scheduled with {appointment.Patient.FirstName} on {appointment.AppointmentDate.ToShortDateString()} at {appointment.AppointmentTime}.";

            // Send emails
            await _emailService.SendEmailAsync(appointment.Patient.Email, subject, patientBody);
            await _emailService.SendEmailAsync(appointment.Provider.Email, subject, providerBody);

            return new
            {
                status = 200,
                message = "Appointment Updated Successfully"
            };
        }
    }
}
