import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Productos */}
        <Link to="/productos" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Productos</h2>
            <p className="text-gray-600 mb-4">Gestiona el catálogo de productos</p>
            <div className="flex items-center text-blue-500">
              <span>Ver productos</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Tarjeta de Clientes */}
        <Link to="/clientes" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Clientes</h2>
            <p className="text-gray-600 mb-4">Administra la información de clientes</p>
            <div className="flex items-center text-green-500">
              <span>Ver clientes</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Tarjeta de Carrito */}
        <Link to="/carrito" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Carrito</h2>
            <p className="text-gray-600 mb-4">Gestiona las compras pendientes</p>
            <div className="flex items-center text-purple-500">
              <span>Ver carrito</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Tarjeta de Perfil */}
        <Link to="/perfil" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">Perfil</h2>
            <p className="text-gray-600 mb-4">Gestiona tu información personal</p>
            <div className="flex items-center text-orange-500">
              <span>Ver perfil</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Sección de Estadísticas */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Estadísticas Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Productos</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">150</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Clientes Activos</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">45</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Ventas del Mes</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">28</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Pedidos Pendientes</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 