import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
  stock: number;
}

const CarritoPage: React.FC = () => {
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerCarrito = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5200/api/Carrito', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        });
        setProductos(response.data);
        setCargando(false);
      } catch (err) {
        setError('Error al cargar el carrito');
        setCargando(false);
      }
    };

    obtenerCarrito();
  }, []);

  const actualizarCantidad = async (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5200/api/Carrito/${id}`, 
        { cantidad: nuevaCantidad },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setProductos(productos.map(producto => 
        producto.id === id ? { ...producto, cantidad: nuevaCantidad } : producto
      ));
    } catch (err) {
      setError('Error al actualizar la cantidad');
    }
  };

  const eliminarProducto = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5200/api/Carrito/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setProductos(productos.filter(producto => producto.id !== id));
    } catch (err) {
      setError('Error al eliminar el producto');
    }
  };

  const calcularTotal = () => {
    return productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      {productos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Ver Productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {productos.map((producto) => (
                <div key={producto.id} className="p-6 border-b last:border-b-0">
                  <div className="flex items-center">
                    {producto.imagenUrl && (
                      <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                      <p className="text-gray-600">${producto.precio.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                          className="px-2 py-1 border rounded-l-md hover:bg-gray-100"
                          disabled={producto.cantidad <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-t border-b">
                          {producto.cantidad}
                        </span>
                        <button
                          onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}
                          className="px-2 py-1 border rounded-r-md hover:bg-gray-100"
                          disabled={producto.cantidad >= producto.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-semibold">
                        ${(producto.precio * producto.cantidad).toLocaleString()}
                      </p>
                      <button
                        onClick={() => eliminarProducto(producto.id)}
                        className="text-red-600 hover:text-red-800 mt-2"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${calcularTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${calcularTotal().toLocaleString()}</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 mt-4">
                  Proceder al Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarritoPage; 