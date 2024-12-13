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
    public class GetSpecialisationQuery : IRequest<List<Specialisation>>
    {
    }
    public class GetSpecialisationQueryHandler : IRequestHandler<GetSpecialisationQuery, List<Specialisation>>
    {
        private readonly IAppDbContext _appDbContext;
        public GetSpecialisationQueryHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<List<Specialisation>> Handle(GetSpecialisationQuery request, CancellationToken token)
        {
            using var connection = _appDbContext.GetConnection();

            var query = "SELECT * FROM specialisations;";

            var data = await connection.QueryAsync<Specialisation>(query);

            return data.AsList();
        }
    }
}
