using App.Core.Interface;
using App.Core.Model.User;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.User.Command
{
    public class UpdateUserCommand : IRequest<object>
    {
        public int UserId { get; set; }
        public RegistrationDto RegistrationDto { get; set; }
    }
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand , object>
    {
        private readonly IAppDbContext _appDbContext;

        public UpdateUserCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;

        }

        public async Task<object> Handle(UpdateUserCommand command, CancellationToken cancellationToken)
        {
            var userDto = command.RegistrationDto;

            if (userDto == null)
            {
                throw new ArgumentNullException(nameof(userDto), "User data cannot be null.");
            }

            var existingUser = await _appDbContext.Set<Domain.Entities.Users.User>()
                .FirstOrDefaultAsync(u => u.UserId == command.UserId, cancellationToken);

            if (existingUser == null)
            {
                throw new KeyNotFoundException($"User with ID {command.UserId} not found.");
            }

            // Update existing user properties
            existingUser.FirstName = userDto.FirstName;
            existingUser.LastName = userDto.LastName;
            existingUser.Email = userDto.Email;
            existingUser.Dob = userDto.Dob;
            existingUser.Address = userDto.Address;
            existingUser.City = userDto.City;
            existingUser.PhoneNumber = userDto.PhoneNumber;
            existingUser.RegistrationNumber = userDto.RegistrationNumber;

            // Handle profile image upload if provided
            if (userDto.ProfileImage != null)
            {
                string newImagePath = await UploadImagesAsync(userDto.ProfileImage);
                existingUser.ProfileImage = newImagePath;
            }

            //if (userDto.ProfileImage == null)
            //{
            //    existingUser.ProfileImage =
            //}

            // Update the user in the database
            _appDbContext.Set<Domain.Entities.Users.User>().Update(existingUser);
            await _appDbContext.SaveChangesAsync(cancellationToken);

            return true; // Indicate successful update
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
                await profileimage.CopyToAsync(stream);
            }

            return $"/uploads/{filename}";
        }
    } 
}
