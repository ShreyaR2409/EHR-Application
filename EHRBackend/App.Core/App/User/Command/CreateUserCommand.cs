using App.Core.Interface;
using App.Core.Model.User;
using Domain.Entities.Users;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace App.Core.App.User.Command
{
    public class CreateUserCommand : IRequest<object>
    {
        public required RegistrationDto Registration { get; set; }
    }
    public class CreateUserCommandHandle : IRequestHandler<CreateUserCommand , object>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailService _emailService;
        public CreateUserCommandHandle(IAppDbContext appDbContext, IEmailService emailService)
        {
            _appDbContext = appDbContext;
            _emailService = emailService;   
        }

        public async Task<object> Handle(CreateUserCommand command, CancellationToken cancellationToken)
        {
            var user = command.Registration;
            var existingUser = await _appDbContext.Set<Domain.Entities.Users.User>().FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                var responses = new
                {
                    status = 409,
                    message = "User Already Exists"
                };
                return responses;
            }
            string username = await GenerateUsernameAsync(user.FirstName, user.LastName, user.Dob, user.UserTypeId);
            string password = GenerateRandomPassword();

            string imagePath = null;
            if (user.ProfileImage != null)
            {
                imagePath = await UploadImagesAsync(user.ProfileImage);
            }

            var newUser = user.Adapt<Domain.Entities.Users.User>();
            newUser.UserName = username;
            newUser.Password = HashData(password);
            newUser.ProfileImage = imagePath;
            await _appDbContext.Set<Domain.Entities.Users.User>().AddAsync(newUser);
            await _appDbContext.SaveChangesAsync(cancellationToken);
            string subject = "Welcome to Our Application";
            string body = $"Dear {user.FirstName},<br><br>Your registration is successful.<br>Your credentials are:<br>Username: <b>{username}<b><br>Password: <b>{password}<b><br><br>Please change your password after your first login.";
            await _emailService.SendEmailAsync(user.Email, subject, body);
            var response = new
            {
                status = 200,
                message = "User Added Successfully",
                data = newUser
            };
            return response;
        }

        private async Task<string> GenerateUsernameAsync(string firstname, string lastname, DateTime dob, int UserType)
        {
            string dobFormatted = dob.ToString("ddMMyy");
            string baseUsername;

            if (UserType == 1)
            {
                baseUsername = $"PR_{firstname.ToUpper()}{lastname[0].ToString().ToUpper()}{dobFormatted}";
            }
            else
            {
                baseUsername = $"PT_{firstname.ToUpper()}{lastname[0].ToString().ToUpper()}{dobFormatted}";
            }

            return await GenerateUniqueUsernameAsync(baseUsername);
        }

        private async Task<string> GenerateUniqueUsernameAsync(string baseUsername)
        {
            string username = baseUsername;
            int counter = 1;

            // Check for existing usernames in the database
            while (await _appDbContext.Set<Domain.Entities.Users.User>()
                                       .AnyAsync(u => u.UserName == username))
            {
                username = $"{baseUsername}{counter}";
                counter++;
            }

            return username;
        }

        private string GenerateRandomPassword()
        {
            const int passwordLength = 8;
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, passwordLength).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public string HashData(string data)
        {
            return BCrypt.Net.BCrypt.HashPassword(data);
        }

        private async Task<string?> UploadImagesAsync(IFormFile profileimage)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string filename = Guid.NewGuid().ToString() + "_" + profileimage.FileName;
            string filePath = Path.Combine(uploadsFolder, filename);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                profileimage.CopyTo(stream);
            }
            return $"/uploads/{filename}";
        }
    }
}
