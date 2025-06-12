import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  correoElectronico: string;
  telefono: string;
  fechaCreacion: string;
  fechaModificacion: string;
  activo: boolean;
  usuarioId: number | null;
  direcciones: any | null;
}

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5200/api/Clientes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        });
        setClientes(response.data);
        setCargando(false);
      } catch (err) {
        setError('Error al cargar los clientes');
        setCargando(false);
      }
    };

    obtenerClientes();
  }, []);

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
      <h1 className="text-3xl font-bold mb-6">Clientes</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">ID</th>
              <th className="px-6 py-3 border-b text-left">Nombre</th>
              <th className="px-6 py-3 border-b text-left">Apellido</th>
              <th className="px-6 py-3 border-b text-left">RUT</th>
              <th className="px-6 py-3 border-b text-left">Correo</th>
              <th className="px-6 py-3 border-b text-left">Teléfono</th>
              <th className="px-6 py-3 border-b text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{cliente.id}</td>
                <td className="px-6 py-4 border-b">{cliente.nombre}</td>
                <td className="px-6 py-4 border-b">{cliente.apellido}</td>
                <td className="px-6 py-4 border-b">{cliente.rut}</td>
                <td className="px-6 py-4 border-b">{cliente.correoElectronico}</td>
                <td className="px-6 py-4 border-b">{cliente.telefono}</td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${cliente.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {cliente.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientesPage; 