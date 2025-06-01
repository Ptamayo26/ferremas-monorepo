using Microsoft.AspNetCore.Mvc;
using Ferremas.Api.Services;
using Ferremas.Api.DTOs;
using System.Threading.Tasks;

namespace Ferremas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ShipitService _shipitService;

        public TestController(ShipitService shipitService)
        {
            _shipitService = shipitService;
        }

        [HttpPost("test-envio")]
        public async Task<IActionResult> TestEnvio(EnvioCreateDTO envioDto)
        {
            try
            {
                // Generar un ID único para el pedido usando timestamp (solo minutos y segundos)
                envioDto.PedidoId = int.Parse(DateTime.Now.ToString("mmss"));
                
                var resultado = await _shipitService.CrearEnvio(envioDto);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al crear el envío", detalles = ex.Message });
            }
        }
    }
} 