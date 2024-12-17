﻿using App.Core.Interface;
using Dapper;
using Domain.Entities.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.App.User.Querys
{
    public class GetAllPatient :  IRequest<List<Domain.Entities.Users.User>>
    {
    }
    public class GetAllPatientHandler : IRequestHandler<GetAllPatient , List<Domain.Entities.Users.User>>
    {
        private readonly IAppDbContext _appDbContext;
        public GetAllPatientHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<List<Domain.Entities.Users.User>> Handle(GetAllPatient request, CancellationToken cancellationToken)
        {
            using var connection = _appDbContext.GetConnection();

            var query = "SELECT * FROM users where UserTypeId = 2;";

            var data = await connection.QueryAsync<dynamic>(query);

            // Convert the DateTime to DateOnly
            var users = data.Select(d => new Domain.Entities.Users.User
            {
                UserId = d.UserId,
                FirstName = d.FirstName,
                LastName = d.LastName,
                Dob = d.Dob,  // Convert DateTime to DateOnly
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
                SpecialisationId = d.SpecialisationId,
                RegistrationNumber = d.RegistrationNumber,
                ProfileImage = d.ProfileImage,
                PhoneNumber = d.PhoneNumber
            }).ToList();

            return users;
        }
    }
}