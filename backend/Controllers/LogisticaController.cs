using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Ferremas.Api.Services;
using Ferremas.Api.DTOs;
using Ferremas.Api.Models;
using Ferremas.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Ferremas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LogisticaController : ControllerBase
    {
        private readonly ShipitService _shipitService;
        private readonly ILogger<LogisticaController> _logger;
        private readonly AppDbContext _dbContext;

        public LogisticaController(
            ShipitService shipitService,
            ILogger<LogisticaController> logger,
            AppDbContext dbContext)
        {
            _shipitService = shipitService;
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpPost("envios")]
        public async Task<ActionResult<ApiResponse<ShipitResponse>>> CrearEnvio(EnvioCreateDTO envio)
        {
            try
            {
                // Verificar que el pedido existe
                var pedido = await _dbContext.Pedidos.FindAsync(envio.PedidoId);
                if (pedido == null)
                {
                    return BadRequest(ApiResponse<ShipitResponse>.CrearError("El pedido no existe"));
                }

                // Verificar si ya existe un envío para este pedido
                var envioExistente = await _dbContext.Envios
                    .FirstOrDefaultAsync(e => e.PedidoId == envio.PedidoId);
                
                if (envioExistente != null)
                {
                    return BadRequest(ApiResponse<ShipitResponse>.CrearError(
                        $"Ya existe un envío para el pedido {envio.PedidoId}. Tracking: {envioExistente.TrackingUrl}"));
                }

                var resultado = await _shipitService.CrearEnvio(envio);

                // Guardar en la base de datos solo si Shipit responde OK
                if (!string.IsNullOrEmpty(resultado.TrackingNumber))
                {
                    var envioModel = new Envio
                    {
                        PedidoId = envio.PedidoId,
                        Pedido = pedido,
                        DireccionEnvio = envio.DireccionDestino,
                        EstadoEnvio = resultado.Status ?? "EN_PREPARACION",
                        ProveedorTransporte = "Shipit",
                        TrackingUrl = resultado.TrackingNumber,
                        Observaciones = envio.InstruccionesEspeciales,
                        ComunaDestino = envio.ComunaDestino,
                        RegionDestino = envio.RegionDestino,
                        TelefonoContacto = envio.TelefonoContacto,
                        NombreDestinatario = envio.NombreDestinatario,
                        FechaCreacion = DateTime.UtcNow
                    };

                    _dbContext.Envios.Add(envioModel);
                    await _dbContext.SaveChangesAsync();
                }

                return Ok(ApiResponse<ShipitResponse>.CrearExito(resultado));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear envío");
                return BadRequest(ApiResponse<ShipitResponse>.CrearError(ex.Message));
            }
        }
    }
} 