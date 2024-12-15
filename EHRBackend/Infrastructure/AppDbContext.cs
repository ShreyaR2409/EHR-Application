using App.Core.Interface;
using Domain.Entities.Appointments;
using Domain.Entities.Common;
using Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> users { get; set; }
        public DbSet<State> states { get; set; }
        //public DbSet<City> cities { get; set; }
        public DbSet<Specialisation> specialisations { get; set; }
        public DbSet<Otp> otps { get; set; }
        public DbSet<Country> country { get; set; }
        public DbSet<BloodGroup> bloodGroups { get; set; }      
        public DbSet<Gender> gender { get; set; }
        public DbSet<UserType> userTypes { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<SoapNotes> SoapNotes { get; set; }

        public IDbConnection GetConnection()
        {
            return this.Database.GetDbConnection();
        }
    }
}
