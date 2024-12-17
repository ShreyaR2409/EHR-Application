using App.Core.Interface;
using App.Core.Model.Appointment;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Query
{
    public class GetAppointmentsQuery : IRequest<List<GetAppointmentDto>>
    {
        public int UserId { get; set; }
        public string Role { get; set; }
    }
    public class GetAppointmentsQueryHandler : IRequestHandler<GetAppointmentsQuery, List<GetAppointmentDto>>
    {
        private readonly IAppDbContext _context;

        public GetAppointmentsQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<GetAppointmentDto>> Handle(GetAppointmentsQuery request, CancellationToken cancellationToken)
        {
            IQueryable<Domain.Entities.Appointments.Appointment> query;

            // Handle role-specific queries
            if (request.Role == "Patient")
            {
                query = _context.Set<Domain.Entities.Appointments.Appointment>()
                    .Where(a => a.PatientId == request.UserId);
            }
            else if (request.Role == "Provider")
            {
                query = _context.Set<Domain.Entities.Appointments.Appointment>()
                    .Where(a => a.ProviderId == request.UserId && a.AppointmentDate >= DateTime.Now.Date);
            }
            else
            {
                return new List<GetAppointmentDto>();  // Handle any other roles if necessary
            }

            // Join with the User table to get the correct name based on role
            var appointmentsWithUserData = await query
                .OrderByDescending(a => a.AppointmentDate)
                .ThenByDescending(a => a.AppointmentTime)
                .Select(a => new GetAppointmentDto
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    ProviderId = a.ProviderId,
                    AppointmentDate = a.AppointmentDate,
                    AppointmentTime = a.AppointmentTime,
                    ChiefComplaint = a.ChiefComplaint,
                    AppointmentStatus = a.AppointmentStatus,
                    Fee = a.Fee,
                    FirstName = request.Role == "Patient" ? a.Provider.FirstName : a.Patient.FirstName,  // Conditional FirstName based on role
                    LastName = request.Role == "Patient" ? a.Provider.LastName : a.Patient.LastName   // Conditional LastName based on role
                })
                .ToListAsync(cancellationToken);

            return appointmentsWithUserData;
        }
    }

}
