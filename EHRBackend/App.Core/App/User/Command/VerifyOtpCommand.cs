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
    public class VerifyOtpCommand : IRequest<object>
    {
        public OtpDto OtpDto { get; set; }
    }
    public class VerifyOtpCommandHandler : IRequestHandler<VerifyOtpCommand , object>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IJwtService _jwtService;

        public VerifyOtpCommandHandler(IAppDbContext appDbContext, IJwtService jwtService)
        {
            _appDbContext = appDbContext;
            _jwtService = jwtService;
        }

        public async Task<object> Handle(VerifyOtpCommand command, CancellationToken cancellationToken)
        {
            var verifyOtpModel = command.OtpDto;

            var user = await _appDbContext.Set<Domain.Entities.Users.User>().FirstOrDefaultAsync(x => x.UserName == verifyOtpModel.Username);
          if (user == null)
            {
                return new
                {
                    status = 404,
                    message = "User Not Found"
                };
            }

            var otpEntity = await _appDbContext.Set<Domain.Entities.Common.Otp>().FirstOrDefaultAsync(x => x.UserId == user.UserId && x.LatestOtp == verifyOtpModel.Otp);
            if (otpEntity == null)
            {
                return new
                {
                    status = 404,
                    message = "Invalid OTP"
                };
            }

            var role = await _appDbContext.Set<Domain.Entities.Users.UserType>().FirstOrDefaultAsync(r => r.UserTypeId == user.UserTypeId);
            if (role == null)
            {
                return new
                {
                    status = 404,
                    message = "Role Not Found"
                };
            }

            // Generate JWT token for the user
            return new
            {
                Token = _jwtService.GenerateToken(user, role.UserTypeName)
            };
        }
    }
}
