using App.Core.Interface;
using Dapper;
using Domain.Entities.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.Utility.Query
{
    public class GetAllCountriesQuery : IRequest<List<Country>>
    {
    }

    public class GetAllCountriesQueryHandler : IRequestHandler<GetAllCountriesQuery, List<Country>>
    {
        private readonly IAppDbContext _appDbContext;
        public GetAllCountriesQueryHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<List<Country>> Handle(GetAllCountriesQuery request, CancellationToken token)
        {
            using var connection = _appDbContext.GetConnection();

            var query = "SELECT * FROM Country;";

            var data = await connection.QueryAsync<Country>(query);

            return data.AsList();
        }

    }
}
