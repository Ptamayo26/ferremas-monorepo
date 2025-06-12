import { Link, useLocation, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/clientes", label: "Clientes" },
  { to: "/proveedores", label: "Proveedores" },
  { to: "/productos", label: "Productos" },
  { to: "/inventario", label: "Inventario" },
  { to: "/pedidos", label: "Pedidos" },
  { to: "/facturas", label: "Facturas" },
  { to: "/pagos", label: "Pagos" },
  { to: "/usuarios", label: "Usuarios" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{
      background: "#1a202c",
      padding: "0.5rem 2rem",
      display: "flex",
      alignItems: "center",
      gap: 24,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      position: "sticky",
      top: 0,
      zIndex: 10
    }}>
      <span style={{ color: "#fff", fontWeight: 700, fontSize: 22, marginRight: 32 }}>Ferremas</span>
      {links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          style={{
            color: location.pathname === link.to ? "#f6ad55" : "#fff",
            textDecoration: "none",
            fontWeight: location.pathname === link.to ? 700 : 400,
            fontSize: 16,
            padding: "6px 12px",
            borderRadius: 4,
            background: location.pathname === link.to ? "#2d3748" : "none",
            transition: "background 0.2s"
          }}
        >
          {link.label}
        </Link>
      ))}
      <div style={{ marginLeft: "auto" }}>
        {token ? (
          <button onClick={handleLogout} style={{ background: "#e53e3e", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}>
            Cerrar sesión
          </button>
        ) : (
          <button onClick={() => navigate("/login")}
            style={{ background: "#3182ce", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}>
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
export default Navbar; 