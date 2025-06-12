// src/services/api.service.ts
import axios from 'axios';

const API_URL = import.meta.env.PROD 
  ? '/api'  // En producción, usa la ruta relativa
  : 'http://localhost:5200/api';  // En desarrollo, usa la URL completa

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
    };
  }

  // Autenticación
  async login(correo: string, contraseña: string) {
    try {
      const respuesta = await axios.post(`${API_URL}/auth/login`, {
        email:correo,
        password:contraseña
      });
      
      if (respuesta.data.token) {
        localStorage.setItem('token', respuesta.data.token);
        this.token = respuesta.data.token;
      }
      
      return respuesta.data;
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  async logout() {
    localStorage.removeItem('token');
    this.token = null;
  }

  // Productos
  async obtenerProductos() {
    try {
      const respuesta = await axios.get(`${API_URL}/productos`, {
        headers: this.getHeaders()
      });
      return respuesta.data;
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  async obtenerProducto(id: string) {
    try {
      const respuesta = await axios.get(`${API_URL}/productos/${id}`, {
        headers: this.getHeaders()
      });
      return respuesta.data;
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  // Pedidos
  async crearPedido(datosPedido: any) {
    try {
      const respuesta = await axios.post(`${API_URL}/pedidos`, datosPedido, {
        headers: this.getHeaders()
      });
      return respuesta.data;
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  async obtenerPedidos() {
    try {
      const respuesta = await axios.get(`${API_URL}/pedidos`, {
        headers: this.getHeaders()
      });
      return respuesta.data;
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  // Clientes
  async obtenerCliente(id: string) {
    try {
      const respuesta = await axios.get(`${API_URL}/clientes/${id}`, {
        headers: this.getHeaders()
      });
      return respuesta.data;
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  async actualizarCliente(id: string, datos: any) {
    try {
      const respuesta = await axios.put(`${API_URL}/clientes/${id}`, datos, {
        headers: this.getHeaders()
      });
      return respuesta.data;
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  private manejarError(error: any) {
    if (error.response) {
      throw new Error(error.response.data.mensaje || 'Error en la petición');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      throw new Error('Error al procesar la petición');
    }
  }
}

export const apiService = new ApiService();