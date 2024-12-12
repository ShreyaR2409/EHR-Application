using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateOnly Dob { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public string? Gender { get; set; }
        public string? BloodGroup { get; set; }
        public string? Address { get; set; }
        [ForeignKey("City")]
        public int CityId { get; set; }
        public required City City { get; set; }
        public int StateId { get; set; }
        public string? PinCode { get; set; }
        [ForeignKey("UserType")]
        public int UserTypeId {  get; set; }
        public UserType? UserType { get; set; }
        public string? Qualification { get; set; }
        [ForeignKey("Specialisation")]
        public int SpecialisationId { get; set; }
        public Specialisation? Specialisation { get; set; }
        public string? RegistrationNumber { get; set; }
        public string? VisitingCharge { get; set; }
        public string? ProfileImage { get; set; }
        public string? Password { get; set; } 
        public string? PhoneNumber { get; set; }   
    }
}
