using App.Core.Interface;
using Dapper;
using Domain.Entities.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.User.Querys
{
    public class GetUsernameById : IRequest<object>
    {
        public int UserId { get; set; }
    }
    public class GetUsernameByIdHandler : IRequestHandler<GetUsernameById, object> 
    {
        private readonly IAppDbContext _appDbContext;
        public GetUsernameByIdHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<object> Handle(GetUsernameById request, CancellationToken cancellationToken)
        {
            using var connection = _appDbContext.GetConnection();
            var query = "SELECT * FROM users WHERE UserId = @Id;";
            var data = await connection.QueryAsync<Domain.Entities.Users.User>(query, new { Id = request.UserId });
            var user = data.FirstOrDefault();
            return new
            {
                user.FirstName,
                user.LastName
            };
        }
    }
}
