using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using MySql.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// ASP.NET Core uses Dependency Injection (DI) to manage the lifetime and dependencies of services. 
// By calling AddDbContext<TodoContext>, you are registering TodoContext with the DI container.
builder.Services.AddDbContext<TodoContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .WithMethods("PUT", "DELETE", "GET", "POST")
                  .WithHeaders("Origin", "X-Requested-With", "Content-Type", "Accept");
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();

app.MapControllers();

app.Run();
