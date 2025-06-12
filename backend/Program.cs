using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Ferremas.Api.Middleware;
using Ferremas.Api.Data;
using Ferremas.Api.Services;
using Ferremas.Api.Services.Interfaces;
using FerremasBackend.Services;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Polly;
using Polly.Extensions.Http;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Configuración de logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// ✅ Forzar uso de un puerto libre (evita conflicto con el 5000)
builder.WebHost.UseUrls("http://localhost:5200");

// Add services to the container.
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.MissingMemberHandling = Newtonsoft.Json.MissingMemberHandling.Ignore;
        options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Include;
        options.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
    });

// Agregar HttpContextAccessor y HttpClientFactory
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();

// Configure DbContext with MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString),
        mySqlOptions => mySqlOptions
            .EnableRetryOnFailure(
                maxRetryCount: 10,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null)
    );
});

// Add services
builder.Services.AddScoped<IProductosService, ProductosService>();
builder.Services.AddScoped<IPedidosService, PedidosService>();
builder.Services.AddScoped<IComparadorService, ComparadorService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEnvioService, EnvioService>();
builder.Services.AddScoped<IPagosService, PagosService>();
builder.Services.AddScoped<IUsuariosService, UsuariosService>();
builder.Services.AddScoped<ILoggingService, LoggingService>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<MercadoPagoService>();
builder.Services.AddScoped<FakePaymentService>();

// Configuración mejorada de MercadoLibreService con HttpClient
builder.Services.AddHttpClient<MercadoLibreService>(client =>
{
    client.BaseAddress = new Uri("https://api.mercadolibre.com/");
    client.DefaultRequestHeaders.Add("Accept", "application/json, text/plain, */*");
    client.DefaultRequestHeaders.Add("User-Agent", 
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
    client.DefaultRequestHeaders.Add("Accept-Language", "es-ES,es;q=0.9,en;q=0.8");
    client.DefaultRequestHeaders.Add("Cache-Control", "no-cache");
    client.Timeout = TimeSpan.FromSeconds(30);
})
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler()
{
    UseCookies = false,
    UseDefaultCredentials = false
})
.AddPolicyHandler(GetRetryPolicy());

// Configuración de MercadoPagoService con HttpClient y Polly
builder.Services.AddHttpClient<MercadoPagoService>(client =>
{
    client.BaseAddress = new Uri("https://api.mercadopago.com/");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    client.DefaultRequestHeaders.Add("User-Agent", "Ferremas-App/1.0");
    client.Timeout = TimeSpan.FromSeconds(30);
})
.AddPolicyHandler(GetRetryPolicy());

// Inyección directa de servicios
builder.Services.AddScoped<MercadoLibreService>();
builder.Services.AddScoped<MercadoPagoService>();

// Nuevos servicios para módulos adicionales
builder.Services.AddScoped<IProveedoresService, ProveedoresService>();
builder.Services.AddScoped<IFacturaService, FacturaService>();
builder.Services.AddScoped<INotificacionesService, NotificacionesService>();
builder.Services.AddScoped<IReportesService, ReportesService>();
builder.Services.AddScoped<IDescuentoService, DescuentoService>();

// Configuración de WhatsAppWebService
builder.Services.AddScoped<WhatsAppWebService>();

// Configuración de ShipitService con HttpClient
builder.Services.AddHttpClient<ShipitService>(client =>
{
    client.BaseAddress = new Uri("https://api.shipit.cl/v/");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    client.DefaultRequestHeaders.Add("User-Agent", "Ferremas-App/1.0");
    client.Timeout = TimeSpan.FromSeconds(30);
})
.AddPolicyHandler(GetRetryPolicy());

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
               
    // CORS específico para API pública
    options.AddPolicy("ApiPublica", policy =>
        policy.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader()
               .WithExposedHeaders("X-RateLimit-Remaining", "X-RateLimit-Reset"));
});

// Add Swagger con configuración SOLO para controladores
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Solo UN documento swagger
    c.SwaggerDoc("v1", new OpenApiInfo { 
        Title = "Ferremas API", 
        Version = "v1",
        Description = "API para gestión de ferretería",
        Contact = new OpenApiContact
        {
            Name = "Equipo Ferremas",
            Email = "soporte@ferremas.cl"
        }
    });
    
    // Configuración de autenticación JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
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

    // Filtrar endpoints específicos y bloquear rutas fantasma
    c.DocInclusionPredicate((docName, apiDescription) => 
    {
        var relativePath = apiDescription.RelativePath?.ToLower() ?? "";
        
        // BLOQUEAR rutas fantasma específicas
        if (relativePath.Contains("ferremas-comparison"))
            return false;
        
        // Incluir todos los endpoints excepto los específicamente excluidos
        return !relativePath.Contains("v1/docs");
    });

    // Configuración para nombres de operaciones
    c.CustomSchemaIds(type => type.FullName);
    c.CustomOperationIds(apiDesc => apiDesc.RelativePath);
});

// Configure JWT con configuración mejorada
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"];
if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT SecretKey no configurada en appsettings.json");
}

var key = Encoding.ASCII.GetBytes(secretKey);
builder.Services.AddAuthentication(options => 
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Solo para desarrollo
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        RoleClaimType = ClaimTypes.Role
    };

    // Event handlers para debugging JWT
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogDebug("Token JWT validado para usuario: {UserId}", 
                context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogWarning("Falló la autenticación JWT: {Error}", context.Exception.Message);
            return Task.CompletedTask;
        }
    };
});

// Configuración de autorización con políticas mejoradas
builder.Services.AddAuthorization(options =>
{
    // Política por defecto
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();

    // Política específica para administrador
    options.AddPolicy("RequireAdministrador", policy =>
        policy.RequireRole("administrador"));

    // Configurar el mapeo de claims de roles
    options.AddPolicy("RequireRole", policy =>
        policy.RequireAssertion(context =>
        {
            var roleClaims = context.User.Claims
                .Where(c => c.Type == ClaimTypes.Role || c.Type == "rol")
                .Select(c => c.Value);
            return roleClaims.Any(role => 
                role == "administrador" || 
                role == "vendedor" || 
                role == "bodeguero" || 
                role == "contador");
        }));

    // Política para vendedores y administradores
    options.AddPolicy("RequireVendedorOrAdmin", policy =>
        policy.RequireAssertion(context =>
        {
            var roles = context.User.Claims
                .Where(c => c.Type == ClaimTypes.Role || c.Type == "rol")
                .Select(c => c.Value.ToLower());
            return roles.Contains("administrador") || roles.Contains("vendedor");
        }));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ferremas API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "Ferremas API - Documentación";
        c.DefaultModelsExpandDepth(-1); // Colapsar modelos por defecto
        c.DisplayRequestDuration();
    });
}
else
{
    // En producción, usar manejo de errores más restrictivo
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Middleware pipeline en orden correcto
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowAll");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Middleware para headers personalizados
app.Use(async (context, next) =>
{
    // Agregar headers informativos generales
    context.Response.Headers.Add("X-API-Version", "1.0");
    context.Response.Headers.Add("X-Provider", "Ferremas-Chile");
    
    await next();
});

// Mapear controladores
app.MapControllers();

// Endpoint de salud para monitoreo
app.MapGet("/health", () => Results.Ok(new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    version = "1.0.0",
    environment = app.Environment.EnvironmentName
}))
.WithName("Health")
.WithTags("Health")
.AllowAnonymous();

// Endpoint para información de la API - EXCLUIDO de Swagger
app.MapGet("/", () => new
{
    message = "Ferremas API",
    version = "1.0.0",
    description = "API para gestión de ferretería y comparación de precios",
    documentation = "/swagger",
    health = "/health",
    timestamp = DateTime.UtcNow
})
.ExcludeFromDescription(); // ← Excluir de Swagger

// Endpoint de documentación simplificado - EXCLUIDO de Swagger
app.MapGet("/api/v1/docs", () => new
{
    title = "Ferremas API",
    version = "1.0.0",
    description = "API para gestión de productos, pedidos y comparación de precios",
    swagger = "/swagger",
    health = "/health",
    features = new[]
    {
        "Gestión de productos",
        "Gestión de pedidos", 
        "Gestión de usuarios",
        "Comparación de precios",
        "Integración con MercadoLibre",
        "Integración con MercadoPago",
        "Gestión de envíos"
    },
    contact = new
    {
        email = "soporte@ferremas.cl",
        website = "https://ferremas.cl"
    },
    timestamp = DateTime.UtcNow
})
.ExcludeFromDescription(); // ← Excluir de Swagger

// Configuración y verificación de base de datos
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();
        
        logger.LogInformation("Intentando conectar a la base de datos...");
        await context.Database.EnsureCreatedAsync();
        logger.LogInformation("✅ Conexión a la base de datos establecida correctamente.");
        
        // Verificar que las tablas principales existen
        var tablesExist = await context.Database.CanConnectAsync();
        if (tablesExist)
        {
            logger.LogInformation("✅ Verificación de conectividad completada.");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "❌ Error al conectar con la base de datos:");
        logger.LogError("Verifica que:");
        logger.LogError("1. MySQL está instalado y ejecutándose");
        logger.LogError("2. Las credenciales en appsettings.json son correctas");
        logger.LogError("3. El usuario tiene permisos para acceder a la base de datos 'ferremas_integrada'");
        logger.LogError("4. El puerto 3306 está disponible");
        logger.LogError($"Error detallado: {ex.Message}");
        
        // En desarrollo, mostrar el error pero continuar
        if (app.Environment.IsDevelopment())
        {
            logger.LogWarning("⚠️  Continuando en modo desarrollo sin base de datos");
        }
        else
        {
            throw; // En producción, fallar completamente
        }
    }
}

// Log de inicio de la aplicación
var startupLogger = app.Services.GetRequiredService<ILogger<Program>>();
startupLogger.LogInformation("🚀 Ferremas API iniciada correctamente");
startupLogger.LogInformation("📍 Disponible en: http://localhost:5200");
startupLogger.LogInformation("📖 Documentación en: http://localhost:5200/swagger");
startupLogger.LogInformation("💊 Health check en: http://localhost:5200/health");
startupLogger.LogInformation("🌐 API Pública en: http://localhost:5200/api/v1/ferremas-comparison/info");
startupLogger.LogInformation("📚 Docs API Pública: http://localhost:5200/api/v1/docs");

app.Run();

// Método para configurar la política de reintentos mejorada
static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError() // HttpRequestException y 5XX, 408
        .OrResult(msg => 
            msg.StatusCode == System.Net.HttpStatusCode.TooManyRequests || // 429
            msg.StatusCode == System.Net.HttpStatusCode.Unauthorized ||    // 401
            msg.StatusCode == System.Net.HttpStatusCode.Forbidden ||       // 403
            msg.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable) // 503
        .WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
            onRetry: (outcome, timespan, retryCount, context) =>
            {
                // Log simple sin usar context.GetLogger()
                Console.WriteLine($"Retry {retryCount} after {timespan.TotalMilliseconds}ms");
            });
}