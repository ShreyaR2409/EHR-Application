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
    public class GetProviderBySpecialisationId : IRequest<List<Domain.Entities.Users.User>>
    {
        public int Id { get; set; }
    }

    public class GetProviderBySpecialisationIdHandler : IRequestHandler<GetProviderBySpecialisationId, List<Domain.Entities.Users.User>>
    {
        private readonly IAppDbContext _appDbContext;

        public GetProviderBySpecialisationIdHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<List<Domain.Entities.Users.User>> Handle(GetProviderBySpecialisationId request, CancellationToken cancellationToken)
        {
            using var connection = _appDbContext.GetConnection();
            var query = "SELECT * FROM users WHERE SpecialisationId = @Id;";

            var data = await connection.QueryAsync<Domain.Entities.Users.User>(query, new { Id = request.Id });

            var users = data.Select(d => new Domain.Entities.Users.User
            {
                UserId = d.UserId,
                FirstName = d.FirstName,
                LastName = d.LastName,
                Dob = d.Dob,
                UserName = d.UserName,
                Email = d.Email,
                GenderId = d.GenderId,
                BloodGroupId = d.BloodGroupId,
                Address = d.Address,
                CountryId = d.CountryId,
                City = d.City,
                StateId = d.StateId,
                PinCode = d.PinCode,
                UserTypeId = d.UserTypeId,
                Qualification = d.Qualification,
                VisitingCharge = d.VisitingCharge,
                SpecialisationId = d.SpecialisationId,
                RegistrationNumber = d.RegistrationNumber,
                ProfileImage = d.ProfileImage,
                PhoneNumber = d.PhoneNumber
            }).ToList();

            return users;
        }
    }
}