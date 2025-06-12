import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { estaAutenticado, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Ferremas</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {estaAutenticado ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link to="/productos" className="text-gray-600 hover:text-gray-900">Productos</Link>
                <Link to="/clientes" className="text-gray-600 hover:text-gray-900">Clientes</Link>
                <Link to="/proveedores" className="text-gray-600 hover:text-gray-900">Proveedores</Link>
                <Link to="/carrito" className="text-gray-600 hover:text-gray-900">Carrito</Link>
                <Link to="/perfil" className="text-gray-600 hover:text-gray-900">Perfil</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {estaAutenticado ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  to="/productos"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Productos
                </Link>
                <Link
                  to="/clientes"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Clientes
                </Link>
                <Link
                  to="/proveedores"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Proveedores
                </Link>
                <Link
                  to="/carrito"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Carrito
                </Link>
                <Link
                  to="/perfil"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-500 hover:text-red-600"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 text-blue-500 hover:text-blue-600"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}; 