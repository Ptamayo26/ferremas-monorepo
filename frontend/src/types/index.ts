// src/types/index.ts
export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    imagen?: string;
  }
  
  export interface Pedido {
    id: number;
    clienteId: number;
    fecha: string;
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
    total: number;
    items: PedidoItem[];
  }
  
  export interface PedidoItem {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
  }
  
  export interface Cliente {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  }