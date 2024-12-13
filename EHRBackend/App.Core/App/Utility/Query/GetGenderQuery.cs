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
    public class GetGenderQuery : IRequest<List<Gender>>
    {
    }
    public class GetGenderQueryHandler : IRequestHandler<GetGenderQuery, List<Gender>>
    {
        private readonly IAppDbContext _appDbContext;
        public GetGenderQueryHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<List<Gender>> Handle(GetGenderQuery request, CancellationToken token)
        {
            using var connection = _appDbContext.GetConnection();

            var query = "SELECT * FROM gender;";

            var data = await connection.QueryAsync<Gender>(query);

            return data.AsList();
        }
    }

}
