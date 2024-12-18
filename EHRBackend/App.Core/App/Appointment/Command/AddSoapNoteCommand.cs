using App.Core.Interface;
using App.Core.Model.Appointment;
using Domain.Entities.Appointments;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Command
{
    public class AddSoapNoteCommand : IRequest<object>
    {
        public SoapNoteDto SoapNote { get; set; }
    }
    public class AddSoapNoteCommandHandler : IRequestHandler<AddSoapNoteCommand, object>
    {
        private readonly IAppDbContext _appDbContext;
        public AddSoapNoteCommandHandler(IAppDbContext appDbContext)
        {
                _appDbContext = appDbContext;
        }
        public async Task<object> Handle(AddSoapNoteCommand command, CancellationToken cancellationToken)
        {
            var dto = command.SoapNote;
            if (dto == null)
            {
                return new
                {
                    status = 404,
                    message = "Invalid Request"
                };
            }

            var note = new Domain.Entities.Appointments.SoapNotes
            {
                AppointmentId = dto.AppointmentId,
                Subjective = dto.Subjective,
                Objective = dto.Objective,
                Assessment = dto.Assessment,
                Plan = dto.Plan
            }; 

            await _appDbContext.Set<Domain.Entities.Appointments.SoapNotes>().AddAsync(note, cancellationToken);
            await _appDbContext.SaveChangesAsync(cancellationToken);
            return new
            {
                status = 200,
                message = "Soap Note Added Successfully",
                data = dto,
            };
        }
    }
}
