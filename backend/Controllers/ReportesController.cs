using Ferremas.Api.DTOs;
using Ferremas.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Ferremas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireAdministrador")]
    public class ReportesController : ControllerBase
    {
        private readonly IReportesService _reportesService;

        public ReportesController(IReportesService reportesService)
        {
            _reportesService = reportesService;
        }

        [HttpGet("ventas/mes/{mes}/{anio}")]
        public async Task<ActionResult<decimal>> GetVentasTotalesMes(int mes, int anio)
        {
            var total = await _reportesService.ObtenerVentasTotalesMes(mes, anio);
            return Ok(total);
        }

        [HttpGet("productos/top/{cantidad}")]
        public async Task<ActionResult<List<ProductoVentaDTO>>> GetTopProductosVendidos(int cantidad)
        {
            var productos = await _reportesService.ObtenerTopProductosVendidos(cantidad);
            return Ok(productos);
        }

        [HttpGet("inventario/bajo-stock")]
        public async Task<ActionResult<List<ProductoDTO>>> GetProductosBajoStock()
        {
            var productos = await _reportesService.ObtenerProductosBajoStock();
            return Ok(productos);
        }
    }
} 