using App.Core.Interface;
using Dapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.User.Querys
{
    public class GetUserByUsername : IRequest<object>   
    {
        public string UserName { get; set; }
    }
    public class GetUserByUsernameHandler : IRequestHandler<GetUserByUsername, object>
    {
        private IAppDbContext _appDbContext;
        public GetUserByUsernameHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<object> Handle(GetUserByUsername request, CancellationToken cancellationToken)
        {
            using var connection = _appDbContext.GetConnection();
            var query = "SELECT * FROM users WHERE username = @UserName;";
            var user = await connection.QueryFirstOrDefaultAsync<dynamic>(query, new { request.UserName });
            if (user == null) 
            {
                return new
                {
                    status = 404,
                    message = "Not Found"
                };
            }
            return user;
                 
        }
    }
}
