using App.Core.Interface;
using App.Core.Model.User;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.User.Command
{
    public class ChangePasswordCommand : IRequest<object>
    {
        public ChangePasswordDto ChangePassword { get; set; }
    }
    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, object>
    {
        private readonly IAppDbContext _appDbContext;

        public ChangePasswordCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;

        }
        public async Task<object> Handle(ChangePasswordCommand command, CancellationToken cancellationToken)
        {
            var dto = command.ChangePassword;

            // Find the user by ID
            var user = await _appDbContext.Set<Domain.Entities.Users.User>()
                .FirstOrDefaultAsync(u => u.UserId == dto.UserId, cancellationToken);

            // Check if user is found
            if (user == null)
            {
                return new
                {
                    status = 404,
                    message = "User Not Found"
                };
            }

            // Hash the new password and set it
            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            // Update the user in the database
            _appDbContext.Set<Domain.Entities.Users.User>().Update(user);
            await _appDbContext.SaveChangesAsync(cancellationToken);

            return new
            {
                status = 200,
                message = "Password Changed Successfully"
            };
        }
    }
}
