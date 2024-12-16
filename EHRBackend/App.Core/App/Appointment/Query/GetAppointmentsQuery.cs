using App.Core.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Query
{
    public class GetAppointmentsQuery : IRequest<List<Domain.Entities.Appointments.Appointment>>
    {
        public int UserId { get; set; }
        public string Role { get; set; }
    }
    public class GetAppointmentsQueryHandler : IRequestHandler<GetAppointmentsQuery, List<Domain.Entities.Appointments.Appointment>>
    {
        private readonly IAppDbContext _context;

        public GetAppointmentsQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Domain.Entities.Appointments.Appointment>> Handle(GetAppointmentsQuery request, CancellationToken cancellationToken)
        {
            if (request.Role == "Patient")
            {
                return await _context.Set<Domain.Entities.Appointments.Appointment>()
                    .Where(a => a.PatientId == request.UserId)
                    .OrderByDescending(a => a.AppointmentDate)
                    .ThenByDescending(a => a.AppointmentTime)
                    .ToListAsync(cancellationToken);
            }
            else if (request.Role == "Provider")
            {
                return await _context.Set<Domain.Entities.Appointments.Appointment>()
                    .Where(a => a.ProviderId == request.UserId && a.AppointmentDate >= DateTime.Now.Date)
                    .OrderByDescending(a => a.AppointmentDate)
                    .ThenByDescending(a => a.AppointmentTime)
                    .ToListAsync(cancellationToken);
            }
            return new List<Domain.Entities.Appointments.Appointment>();
        }
    }

}
