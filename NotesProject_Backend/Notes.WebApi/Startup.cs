using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using System.Reflection;
using Swashbuckle.AspNetCore.SwaggerGen;
using Notes.Application;
using Notes.Application.Common.Mappings;
using Notes.Persistence;
using MediatR;
using Notes.Application.Notes.Commands.CreateNote;
using Notes.Application.Notes.Commands.DeleteCommand;
using Notes.Application.Notes.Commands.UpdateNote;
using Notes.Application.Notes.Queries.GetNoteDetails;
using Notes.Application.Notes.Queries.GetNoteList;
using Notes.Domain;
using Notes.Application.Interfaces;
using Notes.WebApi.Middleware;

namespace Notes.WebApi
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration) => Configuration = configuration;

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAutoMapper(config =>
            {
                config.AddProfile(new AssemblyMappingProfile(Assembly.GetExecutingAssembly()));
                config.AddProfile(new AssemblyMappingProfile(typeof(INotesDbContext).Assembly));
            });

            services.AddApplication();
            services.AddPersistence(Configuration);
            services.AddControllers();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyHeader();
                    policy.AllowAnyMethod();
                    policy.AllowAnyOrigin();
                });
            });
            services.AddMediatR(typeof(Startup));


            services.AddHttpContextAccessor();
            services.AddTransient<IRequestHandler<CreateNoteCommand, Guid>, CreateNoteCommandHandler>();

            services.AddTransient<IRequestHandler<DeleteNoteCommand, Unit>, DeleteNoteCommandHandler>();

            services.AddTransient<IRequestHandler<UpdateNoteCommand, Unit>, UpdateNoteCommandHandler>();

            services.AddTransient<IRequestHandler<GetNoteDetailsQuery, Note>, GetNoteDetailsQueryHandler>();
            services.AddTransient<IRequestHandler<GetNoteListQuery, NoteListVm>, GetNoteListQueryHandler>();
            
            services.AddSwaggerGen(config =>
            {
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                config.IncludeXmlComments(xmlPath);
            });

        }


        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
            {
                if (env.IsDevelopment())
                {
                    app.UseDeveloperExceptionPage();
                }

                app.UseSwagger();
                app.UseSwaggerUI(config =>
                {
                    config.SwaggerEndpoint("swagger/v1/swagger.json", "Notes API");
                    config.RoutePrefix = string.Empty;
                
                });

                app.UseCustomExceptionHandler();
                app.UseRouting();
                app.UseHttpsRedirection();
                app.UseCors("AllowAll");
                app.UseAuthentication();
                app.UseAuthorization();
                app.UseApiVersioning();
                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                });
            } 
    }
}
