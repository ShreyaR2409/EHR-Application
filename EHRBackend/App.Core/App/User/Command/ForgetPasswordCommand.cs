using App.Core.Interface;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Command
{
    public class ForgetPasswordCommand : IRequest<object>
    {
        public string Email { get; set; }
    }
    public class ForgetPasswordCommandHandler : IRequestHandler<ForgetPasswordCommand, object>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailService _emailService;

        public ForgetPasswordCommandHandler(IAppDbContext appDbContext, IEmailService emailService)
        {
            _appDbContext = appDbContext;
            _emailService = emailService;
        }

        public async Task<object> Handle(ForgetPasswordCommand command, CancellationToken token)
        {
            var email = command.Email;
            var user = await _appDbContext.Set<Domain.Entities.Users.User>().FirstOrDefaultAsync(x => x.Email == email);
            if (user == null)
            {
                return new
                {
                    status = 404,
                    message = "Invalid email. No user found with this email."
                };
            }
            var newPassword = GenerateRandomPassword(8);
            user.Password = HashPassword(newPassword);
            _appDbContext.Set<Domain.Entities.Users.User>().Update(user);
            await _appDbContext.SaveChangesAsync();

            string subject = "Your New Password";
            string body = $@"
                Dear {user.UserName},<br><br>
                Your new password is: <b>{newPassword}</b><br>
                Please use this password to log in and reset it as soon as possible.";
            await _emailService.SendEmailAsync(user.Email, subject, body);

            return new
            {
                status = 200,
                message = "New password sent successfully to your email."
            };
        }
        private string GenerateRandomPassword(int length)
        {
            const string validChars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
            var random = new Random();
            var password = new StringBuilder();

            for (int i = 0; i < length; i++)
            {
                password.Append(validChars[random.Next(validChars.Length)]);
            }

            return password.ToString();
        }

        private string HashPassword(string plainTextPassword)
        {
            return BCrypt.Net.BCrypt.HashPassword(plainTextPassword);
        }
    }
}
