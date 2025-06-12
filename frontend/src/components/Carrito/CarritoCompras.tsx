// src/components/Carrito/CarritoCompras.tsx
import React, { useState, useEffect } from 'react';
import type { Producto } from '../../types/index';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export const CarritoCompras: React.FC = () => {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calcularTotal();
  }, [items]);

  const calcularTotal = () => {
    const nuevoTotal = items.reduce(
      (sum, item) => sum + item.producto.precio * item.cantidad,
      0
    );
    setTotal(nuevoTotal);
  };

  const actualizarCantidad = (productoId: number, nuevaCantidad: number) => {
    setItems(items.map(item => 
      item.producto.id === productoId 
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  const eliminarItem = (productoId: number) => {
    setItems(items.filter(item => item.producto.id !== productoId));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      {items.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.producto.id} className="flex items-center justify-between border-b py-2">
              <div>
                <h3 className="font-semibold">{item.producto.nombre}</h3>
                <p>${item.producto.precio}</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="mx-2">{item.cantidad}</span>
                <button 
                  onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
                <button 
                  onClick={() => eliminarItem(item.producto.id)}
                  className="ml-4 text-red-500"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 text-right">
            <p className="text-xl font-bold">Total: ${total}</p>
            <button 
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => {/* Implementar checkout */}}
            >
              Proceder al pago
            </button>
          </div>
        </>
      )}
    </div>
  );
};