using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Model.User
{
    public class RegistrationDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateTime Dob { get; set; }
        public required string Email { get; set; }
        public int GenderId { get; set; }
        public int BloodGroupId { get; set; }
        public string? Address { get; set; }
        public int CountryId { get; set; }
        public required string City { get; set; }
        public int StateId { get; set; }
        public string? PinCode { get; set; }
        public int UserTypeId { get; set; }
        public string? Qualification { get; set; }
        public int? SpecialisationId { get; set; }
        public string? RegistrationNumber { get; set; }
        public string? VisitingCharge { get; set; }
        public IFormFile? ProfileImage { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
