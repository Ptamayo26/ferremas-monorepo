// src/components/Productos/ListaProductos.tsx
import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api.service';
import type { Producto } from '../../types/index';

export const ListaProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const datos = await apiService.obtenerProductos();
      setProductos(datos);
    } catch (error) {
      setError('Error al cargar los productos');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div>Cargando productos...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {productos.map((producto) => (
        <div key={producto.id} className="border rounded-lg p-4 shadow-sm">
          {producto.imagen && (
            <img 
              src={producto.imagen} 
              alt={producto.nombre}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <h3 className="text-lg font-semibold mt-2">{producto.nombre}</h3>
          <p className="text-gray-600">{producto.descripcion}</p>
          <p className="text-lg font-bold mt-2">${producto.precio}</p>
          <p className="text-sm text-gray-500">Stock: {producto.stock}</p>
          <button 
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {/* Implementar agregar al carrito */}}
          >
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
};