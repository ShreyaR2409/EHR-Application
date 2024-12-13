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
    public class LoginUserCommand : IRequest<object>
    {
        public LoginDto LoginDto { get; set; }
    }
    public class LoginUserCommandHandle : IRequestHandler<LoginUserCommand, object>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwtService;

        public LoginUserCommandHandle(IAppDbContext appDbContext, IEmailService emailService, IJwtService jwtService)
        {
            _appDbContext = appDbContext;
            _emailService = emailService;
            _jwtService = jwtService;
        }

        public async Task<object> Handle (LoginUserCommand command, CancellationToken cancellationToken)
        {
            var LoginModel = command.LoginDto;
            var user = await _appDbContext.Set<Domain.Entities.Users.User>().FirstOrDefaultAsync(x => x.UserName == LoginModel.UserName);
            if(user == null || !VerifyPassword(LoginModel.Password, user.Password))
            {
                return new
                {
                    status = 401,
                    message = "Invalid email or password"
                };
            }
            var otp = GenerateOtp();
            var existingOtp = await _appDbContext.Set<Domain.Entities.Common.Otp>().FirstOrDefaultAsync(x => x.UserId == user.UserId);
            if(existingOtp != null)
            {
                existingOtp.LatestOtp = otp;
                _appDbContext.Set<Domain.Entities.Common.Otp>().Update(existingOtp);
            }
            else
            {
                var otpEntity = new Domain.Entities.Common.Otp
                {
                    UserId = user.UserId,
                    LatestOtp = otp
                };
                await _appDbContext.Set<Domain.Entities.Common.Otp>().AddAsync(otpEntity);
            }
            await _appDbContext.SaveChangesAsync();
            string subject = "Your OTP Code";
            string body = $"Dear {user.UserName},<br><br>Your OTP code is: <b>{otp}</b><br><br>Please use this code to complete your login.";
            await _emailService.SendEmailAsync(user.Email, subject, body);
            var response = new
            {
                status = 200,
                message = "Otp Sent successfuly",
                otpData = otp

            };
            return response;
        }

        public bool VerifyPassword(string plainTextPassword, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(plainTextPassword, hashedPassword);
        }

        public string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }
}
