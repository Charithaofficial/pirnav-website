using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Pirnav.API.Middleware;
using Pirnav.API.Models;
using Pirnav.API.Services;
using Pirnav.API.Validation;
using System.Text;
using System.Threading.RateLimiting;


var builder = WebApplication.CreateBuilder(args);



// =======================
// DATABASE CONFIGURATION
// =======================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("DefaultConnection")
        )
    ));

// =======================
// CORS CONFIGURATION
// =======================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .SetIsOriginAllowed(_ => true)

            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll", policy =>
//    {
//        policy
//        .WithOrigins(
//        "https://pirnav.com",
//        "https://www.pirnav.com"
//        )
//        .AllowAnyHeader()
//        .AllowAnyMethod()
//        .AllowCredentials();
//    });
//});


// =======================
// JWT AUTHENTICATION
// =======================

var jwtSettings = builder.Configuration.GetSection("JwtSettings");

var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;

        options.SaveToken = true;

        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,

                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(key)
            };
    });

builder.Services.AddAuthorization();

// =======================
// RATE LIMITING
// =======================

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("chatLimiter", opt =>
    {
        opt.PermitLimit = 20;

        opt.Window = TimeSpan.FromMinutes(1);

        opt.QueueProcessingOrder =
            QueueProcessingOrder.OldestFirst;

        opt.QueueLimit = 2;
    });

    options.AddFixedWindowLimiter("jobApplyLimiter", opt =>
    {
        opt.PermitLimit = 5;

        opt.Window = TimeSpan.FromMinutes(1);

        opt.QueueProcessingOrder =
            QueueProcessingOrder.OldestFirst;

        opt.QueueLimit = 2;
    });

    options.AddFixedWindowLimiter("contactLimiter", opt =>
    {
        opt.PermitLimit = 3;

        opt.Window = TimeSpan.FromMinutes(1);

        opt.QueueProcessingOrder =
            QueueProcessingOrder.OldestFirst;

        opt.QueueLimit = 1;
    });

    options.RejectionStatusCode = 429;
});

// =======================
// CONTROLLERS + VALIDATION
// =======================

builder.Services.AddControllers();

builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddValidatorsFromAssemblyContaining<AdminRegisterValidator>();

builder.Services.AddValidatorsFromAssemblyContaining<ContactValidator>();

// =======================
// SERVICES
// =======================

builder.Services.AddScoped<ChatService>();

builder.Services.AddScoped<EmailService>();

builder.Services.AddScoped<JobApplicationService>();

builder.Services.AddScoped<FileUploadService>();

builder.Services.AddScoped<AuthService>();

builder.Services.AddHttpClient<EmsService>(client =>
{
    client.BaseAddress =
        new Uri("https://marian-undeported-shanon.ngrok-free.dev/");
});

// =======================
// API VALIDATION RESPONSE
// =======================

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(x => x.Value.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key.ToLower(),
                kvp => kvp.Value.Errors.First().ErrorMessage
            );

        return new BadRequestObjectResult(new
        {
            success = false,
            errors
        });
    };
});

// =======================
// SWAGGER + JWT SUPPORT
// =======================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Pirnav API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter JWT Token: Bearer {your_token}"
        });

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
});

// =======================
// BUILD APP
// =======================

var app = builder.Build();

// =======================
// MIDDLEWARE PIPELINE
// =======================

app.UseSwagger();

app.UseSwaggerUI();

app.UseHttpsRedirection();



app.UseCors("AllowAll");

app.UseStaticFiles();

app.UseRateLimiter();
app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();