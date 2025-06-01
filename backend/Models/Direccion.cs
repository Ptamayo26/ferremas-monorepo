using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ferremas.Api.Models
{
    [Table("direcciones")]
    public class Direccion
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        // [Required]
        // [Column("usuario_id")]
        // public int UsuarioId { get; set; }
        
        [Column("usuario_id")]
        public int? UsuarioId { get; set; }
        
        [Required]
        [StringLength(200)]
        [Column("calle")]
        public string Calle { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        [Column("numero")]
        public string Numero { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        [Column("departamento")]
        public string Departamento { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        [Column("comuna")]
        public string Comuna { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        [Column("region")]
        public string Region { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        [Column("codigo_postal")]
        public string CodigoPostal { get; set; } = string.Empty;
        
        [Column("es_principal")]
        public bool EsPrincipal { get; set; } = false;
        
        [Column("FechaCreacion")]
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        
        [Column("FechaModificacion")]
        public DateTime? FechaModificacion { get; set; }
        
        // Relaciones
        // [ForeignKey("UsuarioId")]
        // public virtual Usuario Usuario { get; set; } = null!;
        
        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }
    }
}