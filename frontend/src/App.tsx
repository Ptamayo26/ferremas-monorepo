import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';

// Pages
import {
  HomePage,
  LoginPage,
  DashboardPage,
  ProductosPage,
  CarritoPage,
  PerfilPage,
  ClientesPage
} from './pages';

interface RutaProtegidaProps {
  children: React.ReactNode;
}

const RutaProtegida: React.FC<RutaProtegidaProps> = ({ children }) => {
  const { estaAutenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return estaAutenticado ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={
              <RutaProtegida>
                <DashboardPage />
              </RutaProtegida>
            } />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="carrito" element={
              <RutaProtegida>
                <CarritoPage />
              </RutaProtegida>
            } />
            <Route path="perfil" element={
              <RutaProtegida>
                <PerfilPage />
              </RutaProtegida>
            } />
            <Route path="clientes" element={
              <RutaProtegida>
                <ClientesPage />
              </RutaProtegida>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
