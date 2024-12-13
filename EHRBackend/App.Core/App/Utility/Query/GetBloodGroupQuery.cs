using App.Core.Interface;
using Dapper;
using Domain.Entities.Common;
using Domain.Entities.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.Utility.Query
{
    public class GetBloodGroupQuery : IRequest<List<BloodGroup>>
    {
    }
    public class GetBloodGroupQueryHandler : IRequestHandler<GetBloodGroupQuery , List<BloodGroup>>
    {
        private readonly IAppDbContext _appDbContext;
        public GetBloodGroupQueryHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<BloodGroup>> Handle(GetBloodGroupQuery request, CancellationToken token)
        {
            using var connection = _appDbContext.GetConnection();

            var query = "SELECT * FROM bloodGroups;";

            var data = await connection.QueryAsync<BloodGroup>(query);

            return data.AsList();
        }
    }
}
