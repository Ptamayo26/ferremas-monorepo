using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using Ferremas.Api.Data;
using Ferremas.Api.Models;

[ApiController]
[Route("api/reportes")]
[Authorize(Roles = "administrador")]
public class ReportesController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReportesController(AppDbContext db) { _db = db; }

    [HttpGet("ventas")]
    public IActionResult Ventas([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
    {
        var query = _db.Pedidos.AsQueryable();
        if (desde.HasValue) query = query.Where(p => p.FechaCreacion >= desde);
        if (hasta.HasValue) query = query.Where(p => p.FechaCreacion <= hasta);
        var total = query.Sum(p => (decimal?)p.Total) ?? 0;
        var cantidad = query.Count();
        return Ok(new { 
            descripcion = "Reporte de ventas que muestra el total monetario y cantidad de pedidos realizados",
            periodo = new {
                desde = desde?.ToString("yyyy-MM-dd HH:mm:ss") ?? "Todo el tiempo",
                hasta = hasta?.ToString("yyyy-MM-dd HH:mm:ss") ?? "Todo el tiempo"
            },
            total = total,
            cantidad = cantidad,
            detalles = "El total representa la suma de todos los pedidos en el período, y la cantidad representa el número total de pedidos realizados"
        });
    }

    [HttpGet("envios")]
    public IActionResult Envios([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
    {
        var query = _db.Envios.AsQueryable();
        if (desde.HasValue) query = query.Where(e => e.FechaCreacion >= desde);
        if (hasta.HasValue) query = query.Where(e => e.FechaCreacion <= hasta);
        var cantidad = query.Count();
        return Ok(new { 
            descripcion = "Reporte de envíos que muestra la cantidad total de envíos realizados",
            periodo = new {
                desde = desde?.ToString("yyyy-MM-dd HH:mm:ss") ?? "Todo el tiempo",
                hasta = hasta?.ToString("yyyy-MM-dd HH:mm:ss") ?? "Todo el tiempo"
            },
            cantidad = cantidad,
            detalles = "La cantidad representa el número total de envíos realizados en el período especificado"
        });
    }
} 