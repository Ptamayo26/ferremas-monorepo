import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a Ferremas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Nuestros Productos</h2>
          <p className="text-gray-600">
            Explora nuestra amplia selección de productos de ferretería y herramientas.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Servicios</h2>
          <p className="text-gray-600">
            Ofrecemos servicios profesionales de instalación y asesoría técnica.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
          <p className="text-gray-600">
            Estamos aquí para ayudarte. Contáctanos para cualquier consulta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 