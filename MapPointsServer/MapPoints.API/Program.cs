using MapPoints.API.Models;
using MapPoints.API.Services.Abstract;
using MapPoints.API.Services.Concreate;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IMapPointRepository, MapPointRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});


var app = builder.Build();

app.UseCors("AllowAllOrigins");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();



app.MapGet("/api/mappoints", async (IMapPointRepository repository) =>
{
    var mapPoints = await repository.GetMapPointsAsync();
    return Results.Ok(mapPoints);
}).WithName("GetMapPoints")
.WithOpenApi();

app.MapPost("/api/mappoints", async (IMapPointRepository repository, MapPoint mapPoint) =>
{
    var newMapPoint = await repository.AddMapPointAsync(mapPoint);
    return Results.Created($"/api/mappoints/{newMapPoint.Id}", newMapPoint);
})
    .WithName("AddMapPoint")
.WithOpenApi();




app.Run();

