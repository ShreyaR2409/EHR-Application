﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities.Common;

namespace Domain.Entities.Users
{
    public class User
    {
        public int UserId { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateTime Dob { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }
        [ForeignKey("Gender")]
        public int GenderId { get; set; }
        public Gender? Gender { get; set; }
        [ForeignKey("BloodGroup")]
        public int BloodGroupId { get; set; }
        public BloodGroup? BloodGroup { get; set; }
        public string? Address { get; set; }
        [ForeignKey("Country")]
        public int CountryId { get; set; }
        public Country? Country { get; set; }
        public string City { get; set; }
        public int StateId { get; set; }
        public string? PinCode { get; set; }
        [ForeignKey("UserType")]
        public int UserTypeId { get; set; }
        public UserType? UserType { get; set; }
        public string? Qualification { get; set; }
        [ForeignKey("Specialisation")]
        public int? SpecialisationId { get; set; }
        public Specialisation? Specialisation { get; set; }
        public string? RegistrationNumber { get; set; }
        public string? VisitingCharge { get; set; }
        public string? ProfileImage { get; set; }
        public string? Password { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
