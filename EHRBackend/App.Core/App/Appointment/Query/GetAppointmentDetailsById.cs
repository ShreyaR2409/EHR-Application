using App.Core.Interface;
using Dapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Query
{
    public class GetAppointmentDetailsById : IRequest<object>
    {
        public int AppointmentId { get; set; }
    }
    public class GetAppointmentDetailsByIdHandler : IRequestHandler<GetAppointmentDetailsById , object>
    {
        private readonly IAppDbContext _appDbContext;
        public GetAppointmentDetailsByIdHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<object> Handle(GetAppointmentDetailsById request, CancellationToken cancellationToken)
        {
            using var connection = _appDbContext.GetConnection();
            var query = "sp_getUserDetails";
            var dbParams = new
            {
                Id = request.AppointmentId
            };
            var data = await connection.QueryAsync<dynamic>
            (
                query,
                dbParams,
                commandType: CommandType.StoredProcedure
            );

            return data.ToList();
        }
    }
}
