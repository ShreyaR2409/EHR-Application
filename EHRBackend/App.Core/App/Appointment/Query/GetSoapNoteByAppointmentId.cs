using App.Core.Interface;
using Dapper;
using Domain.Entities.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Query
{
    public class GetSoapNoteByAppointmentId : IRequest<object>
    {
        public int AppointmentId { get; set; }
    }
    public class GetSoapNoteByAppointmentIdHandler : IRequestHandler<GetSoapNoteByAppointmentId, object>
    {
        private readonly IAppDbContext _appDbContext;
        public GetSoapNoteByAppointmentIdHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<object> Handle(GetSoapNoteByAppointmentId request, CancellationToken cancellationToken)
        {
            using var connection = _appDbContext.GetConnection();
            var query = "SELECT * FROM SoapNotes WHERE AppointmentId = @Id;";
            var data = await connection.QueryAsync<Domain.Entities.Appointments.SoapNotes>(query, new { Id = request.AppointmentId });
            return data.AsList();
        }
    }
}
