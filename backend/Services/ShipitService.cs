using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Ferremas.Api.DTOs;
using System.Text;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Ferremas.Api.Services
{
    public class ShipitService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ShipitService> _logger;
        private readonly string _token;
        private readonly ShipitSettings _settings;

        public ShipitService(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<ShipitService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
            _token = _configuration["Shipit:Token"] ?? throw new InvalidOperationException("Shipit Token no configurada");
            _settings = configuration.GetSection("Shipit:DefaultSettings").Get<ShipitSettings>() 
                ?? throw new InvalidOperationException("Configuración de Shipit no encontrada");
            
            // Configurar headers para Shipit
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("X-Shipit-Email", _configuration["Shipit:Email"]);
            _httpClient.DefaultRequestHeaders.Add("X-Shipit-Access-Token", _token);
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        private int GetCommuneId(string comuna)
        {
            // Diccionario actualizado de comunas con sus IDs en Shipit
            var comunas = new Dictionary<string, int>
            {
                { "Santiago", 1 },
                { "Providencia", 2 },
                { "Las Condes", 3 },
                { "Ñuñoa", 4 },
                { "Maipú", 5 },
                { "Puente Alto", 6 },
                { "La Florida", 7 },
                { "San Bernardo", 8 },
                { "Temuco", 9 },
                { "Concepción", 10 },
                { "Valparaíso", 11 },
                { "Viña del Mar", 12 },
                { "Antofagasta", 13 },
                { "Puerto Montt", 14 },
                { "La Serena", 15 },
                { "Rancagua", 16 },
                { "Talca", 17 },
                { "Chillán", 18 },
                { "Iquique", 19 },
                { "Arica", 20 },
                { "Los Ángeles", 21 },
                { "Osorno", 22 },
                { "Punta Arenas", 23 },
                { "Coyhaique", 24 },
                { "Calama", 25 }
            };

            // Normalizar el nombre de la comuna
            var comunaNormalizada = comuna.Trim().ToLower();
            foreach (var kvp in comunas)
            {
                if (kvp.Key.ToLower() == comunaNormalizada)
                {
                    return kvp.Value;
                }
            }

            _logger.LogWarning($"Comuna no encontrada: {comuna}. Usando comuna por defecto (Santiago)");
            return 1; // Santiago como fallback
        }

        private string NormalizarDireccion(string direccion)
        {
            // Eliminar caracteres especiales y normalizar espacios
            var direccionNormalizada = direccion.Trim()
                .Replace("  ", " ")
                .Replace("N°", "")
                .Replace("Nº", "")
                .Replace("N.", "")
                .Replace("#", "");

            // Extraer número de la dirección
            var partes = direccionNormalizada.Split(' ');
            var numero = "1"; // Valor por defecto

            for (int i = 0; i < partes.Length; i++)
            {
                if (int.TryParse(partes[i], out _))
                {
                    numero = partes[i];
                    break;
                }
            }

            return direccionNormalizada;
        }

        public async Task<ShipitResponse> CrearEnvio(EnvioCreateDTO envio)
        {
            try
            {
                // Validar y normalizar la dirección
                var direccionNormalizada = NormalizarDireccion(envio.DireccionDestino);
                var comunaId = GetCommuneId(envio.ComunaDestino);

                // Generar un ID único para el envío usando los últimos 4 dígitos del timestamp
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
                var ultimos4Digitos = timestamp.Substring(timestamp.Length - 4);
                var referenciaUnica = $"P{envio.PedidoId}-{ultimos4Digitos}";

                var request = new
                {
                    package = new
                    {
                        reference = referenciaUnica,
                        full_name = envio.NombreDestinatario,
                        email = _configuration["Shipit:Email"] ?? "cliente@ferremas.cl",
                        items_count = 1,
                        cellphone = envio.TelefonoContacto,
                        is_payable = _settings.IsPayable,
                        packing = _settings.Packing,
                        shipping_type = _settings.ShippingType,
                        destiny = _settings.Destiny,
                        courier_for_client = _settings.CourierForClient,
                        address_attributes = new
                        {
                            commune_id = comunaId,
                            street = direccionNormalizada,
                            number = "1",
                            complement = envio.InstruccionesEspeciales
                        }
                    }
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(request),
                    Encoding.UTF8,
                    "application/json");

                _logger.LogInformation($"Creando envío para pedido {envio.PedidoId} a {envio.ComunaDestino}");
                _logger.LogInformation($"Dirección normalizada: {direccionNormalizada}");
                _logger.LogInformation($"Comuna ID: {comunaId}");

                var response = await _httpClient.PostAsync("packages", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Error de Shipit: {responseContent}");
                    throw new Exception($"Error de Shipit: {response.StatusCode} - {responseContent}");
                }

                _logger.LogInformation($"Respuesta de Shipit: {responseContent}");

                var shipitResponse = JsonSerializer.Deserialize<ShipitResponse>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (shipitResponse == null)
                {
                    throw new Exception("Error al deserializar la respuesta de Shipit");
                }

                _logger.LogInformation($"Envío creado exitosamente. Tracking: {shipitResponse.TrackingNumber}");
                return shipitResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear envío en Shipit");
                throw new Exception($"Error al crear el envío: {ex.Message}");
            }
        }
    }

    public class ShipitResponse
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("tracking_number")]
        public string TrackingNumber { get; set; } = string.Empty;

        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;

        [JsonPropertyName("reference")]
        public string Reference { get; set; } = string.Empty;

        [JsonPropertyName("full_name")]
        public string FullName { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("cellphone")]
        public string Cellphone { get; set; } = string.Empty;

        [JsonPropertyName("address")]
        public ShipitAddress Address { get; set; } = new ShipitAddress();
    }

    public class ShipitAddress
    {
        [JsonPropertyName("commune")]
        public string Commune { get; set; } = string.Empty;

        [JsonPropertyName("street")]
        public string Street { get; set; } = string.Empty;

        [JsonPropertyName("number")]
        public string Number { get; set; } = string.Empty;

        [JsonPropertyName("complement")]
        public string Complement { get; set; } = string.Empty;
    }

    public class ShipitSettings
    {
        public bool IsPayable { get; set; }
        public string Packing { get; set; } = string.Empty;
        public string ShippingType { get; set; } = string.Empty;
        public string Destiny { get; set; } = string.Empty;
        public string CourierForClient { get; set; } = string.Empty;
    }
} 