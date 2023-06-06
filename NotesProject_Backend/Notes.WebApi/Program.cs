using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
//using Serilog;
//using Serilog.Events;
using System;
using Notes.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.Extensions.Options;

namespace Notes.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            /*
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .WriteTo.File("NotesWebAppLog-.txt", rollingInterval:
                    RollingInterval.Day)
                .CreateLogger();
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<NotesDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));*/

            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<NotesDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), optionsBuilder =>
                    optionsBuilder.MigrationsAssembly("Notes.Persistence")));


            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var serviceProvider = scope.ServiceProvider;
                try
                {
                    var context = serviceProvider.GetRequiredService<NotesDbContext>();
                    DbInitializer.Initialize(context);
                }
                catch (Exception exception)
                {
                    //Log.Fatal(exception, "An error occurred while app initialization");
                }
            }

            var provider = builder.Services.BuildServiceProvider();
            var configuration = provider.GetRequiredService<IConfiguration>();

            builder.Services.AddCors(options =>
            {
                var frontEndURL = configuration.GetValue<string>("frontend_url");

                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins(frontEndURL).AllowAnyMethod().AllowAnyHeader();
                });
            });
            //var app = builder.Build();
            //app.UseCors();

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                //.UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
