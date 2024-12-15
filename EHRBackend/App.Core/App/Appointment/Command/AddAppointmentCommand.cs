using App.Core.Interface;
using App.Core.Model.Appointment;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Command
{
    public class AddAppointmentCommand : IRequest<object>
    {
        public AddAppointmentDto Appointment { get; set; }
    }

    public class AddAppointmentCommandHandler : IRequestHandler<AddAppointmentCommand, object>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailService _emailService;

        public AddAppointmentCommandHandler(IAppDbContext appDbContext, IEmailService emailService)
        {
            _appDbContext = appDbContext;
            _emailService = emailService;
        }

        public async Task<object> Handle(AddAppointmentCommand command, CancellationToken cancellationToken)
        {
            var dto = command.Appointment;

            // Validate date and time
            if (dto.AppointmentDate < DateTime.UtcNow.Date ||
                (dto.AppointmentDate == DateTime.UtcNow.Date && dto.AppointmentTime <= DateTime.UtcNow.AddHours(1).TimeOfDay))
            {
                return new
                {
                    status = 400,
                    message = "Invalid Appointment Date or Time"
                };
            }

            // Validate provider and patient
            var provider = await _appDbContext.Set<Domain.Entities.Users.User>()
                .FirstOrDefaultAsync(u => u.UserId == dto.ProviderId && u.UserType != null && u.UserType.UserTypeName == "Provider", cancellationToken);

            var patient = await _appDbContext.Set<Domain.Entities.Users.User>()
                .FirstOrDefaultAsync(u => u.UserId == dto.PatientId && u.UserType != null && u.UserType.UserTypeName == "Patient", cancellationToken);

            if (provider == null || patient == null)
            {
                return new
                {
                    status = 400,
                    message = "Invalid Provider or Patient"
                };
            }


            // Create new appointment entity
            var appointment = new Domain.Entities.Appointments.Appointment
            {
                PatientId = dto.PatientId,
                ProviderId = dto.ProviderId,
                AppointmentDate = dto.AppointmentDate,
                AppointmentTime = dto.AppointmentTime,
                ChiefComplaint = dto.ChiefComplaint,
                Fee = dto.Fee,
                AppointmentStatus = "Scheduled"
            };

            await _appDbContext.Set<Domain.Entities.Appointments.Appointment>().AddAsync(appointment, cancellationToken);
            await _appDbContext.SaveChangesAsync(cancellationToken);

            // TODO: Send email notifications here using a notification service
            string subject = "Appointment Scheduled";
            string patientBody = $"Your appointment is scheduled for {appointment.AppointmentDate.ToShortDateString()} at {appointment.AppointmentTime} with Dr. {provider.FirstName}.";
            string providerBody = $"You have a new appointment scheduled with {patient.FirstName} on {appointment.AppointmentDate.ToShortDateString()} at {appointment.AppointmentTime}.";

            await _emailService.SendEmailAsync(patient.Email, subject, patientBody);
            await _emailService.SendEmailAsync(provider.Email, subject, providerBody);

            return new
            {
                status = 200,
                message = "Appointment Scheduled Successfully"
            };
        }
    }
}
