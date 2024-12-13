using App.Core.Interface;
using Dapper;
using Domain.Entities.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.Utility.Query
{
    public class GetUserTypeQuery : IRequest<List<UserType>>
    {
    }
    public class GetUserTypeQueryHandler : IRequestHandler<GetUserTypeQuery ,List<UserType>>
    {
        private readonly IAppDbContext _appDbContext;

        public GetUserTypeQueryHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<UserType>> Handle(GetUserTypeQuery request, CancellationToken token)
        {
            using var connection = _appDbContext.GetConnection();

            var query = "SELECT * FROM UserTypes;";

            var data = await connection.QueryAsync<UserType>(query);

            return data.AsList();
        }
    }
}
