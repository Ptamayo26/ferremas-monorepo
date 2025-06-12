// src/components/Cliente/PerfilCliente.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api.service';
import type { Cliente } from '../../types/index';

export const PerfilCliente: React.FC = () => {
  const { usuario } = useAuth();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    if (usuario) {
      cargarDatosCliente();
    }
  }, [usuario]);

  const cargarDatosCliente = async () => {
    try {
      const datos = await apiService.obtenerCliente(usuario.id);
      setCliente(datos);
      setFormData({
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        direccion: datos.direccion
      });
    } catch (error) {
      console.error('Error al cargar datos del cliente:', error);
    }
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.actualizarCliente(usuario.id, formData);
      setEditando(false);
      cargarDatosCliente();
    } catch (error) {
      console.error('Error al actualizar datos:', error);
    }
  };

  if (!cliente) return <div>Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Perfil de Cliente</h2>
      {editando ? (
        <form onSubmit={manejarSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={manejarCambio}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={manejarCambio}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={manejarCambio}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={manejarCambio}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
            <p className="mt-1">{cliente.nombre}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1">{cliente.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
            <p className="mt-1">{cliente.telefono}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
            <p className="mt-1">{cliente.direccion}</p>
          </div>
          <button
            onClick={() => setEditando(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Editar Perfil
          </button>
        </div>
      )}
    </div>
  );
};