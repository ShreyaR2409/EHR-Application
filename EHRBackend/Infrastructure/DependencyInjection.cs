using App.Core.Interface;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Infrastructure.Services;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services,
          IConfigurationManager configuration)
        {
            services.AddScoped<IAppDbContext, AppDbContext>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IJwtService, JwtService>();

            services.AddDbContext<AppDbContext>((provider, options) =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                        b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName));
            });

            return services;
        }
    }
}
