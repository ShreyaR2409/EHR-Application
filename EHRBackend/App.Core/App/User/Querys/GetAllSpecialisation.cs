using App.Core.Interface;
using Dapper;
using Domain.Entities.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.User.Querys
{
    public class GetAllSpecialisation : IRequest<List<Domain.Entities.Users.Specialisation>>
    {
    }
    public class GetAllSpecialisationHandler : IRequestHandler<GetAllSpecialisation, List<Domain.Entities.Users.Specialisation>>
    {
        private readonly IAppDbContext _appDbContext;
        public GetAllSpecialisationHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<List<Domain.Entities.Users.Specialisation>> Handle(GetAllSpecialisation request, CancellationToken cancellationToken)
        {
            using var connection = _appDbContext.GetConnection();

            var query = "SELECT * FROM specialisations;";

            var data = await connection.QueryAsync<Specialisation>(query);

            return data.AsList();
        }
    }
}
