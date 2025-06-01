
-- CREACIÓN DE BASE DE DATOS
CREATE DATABASE IF NOT EXISTS ferremas_integrada;
USE ferremas_integrada;

-- TABLA: usuarios (personal interno)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rut VARCHAR(12) UNIQUE,
    telefono VARCHAR(20),
    rol ENUM('administrador', 'vendedor', 'bodeguero', 'contador') NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso DATETIME,
    activo BOOLEAN DEFAULT TRUE
);

-- TABLA: clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rut VARCHAR(12) UNIQUE NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_cliente ENUM('particular', 'empresa', 'mayorista') DEFAULT 'particular',
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    newsletter BOOLEAN DEFAULT FALSE,
    ultima_compra DATETIME,
    total_compras DECIMAL(10,2) DEFAULT 0,
    numero_compras INT DEFAULT 0
);

-- TABLA: direcciones
CREATE TABLE direcciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    calle VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    departamento VARCHAR(50),
    comuna VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20),
    es_principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- TABLA: categorias
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria_padre_id INT,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_padre_id) REFERENCES categorias(id)
);

-- TABLA: marcas
CREATE TABLE marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    logo_url VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE
);

-- TABLA: productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria_id INT,
    marca_id INT,
    imagen_url VARCHAR(255),
    especificaciones TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (marca_id) REFERENCES marcas(id)
);

-- TABLA: inventario
CREATE TABLE inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    sucursal_id INT,
    stock INT NOT NULL DEFAULT 0,
    ultima_salida DATETIME,
    ultimo_ingreso DATETIME,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- TABLA: sucursales
CREATE TABLE sucursales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    direccion TEXT,
    region VARCHAR(100),
    comuna VARCHAR(100)
);

-- TABLA: pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO', 'PAGADO') NOT NULL DEFAULT 'PENDIENTE',
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- TABLA: pedido_items
CREATE TABLE pedido_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- TABLA: pagos
CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('PENDIENTE', 'COMPLETADO', 'RECHAZADO', 'ANULADO') NOT NULL,
    metodo_pago ENUM('MERCADOPAGO', 'TRANSFERENCIA', 'EFECTIVO') NOT NULL,
    transaccion_id VARCHAR(100),
    token_pasarela VARCHAR(100),
    url_retorno VARCHAR(255),
    datos_respuesta TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- TABLA: carrito
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- TABLA: promociones
CREATE TABLE promociones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    porcentaje_descuento DECIMAL(5,2),
    fecha_inicio DATE,
    fecha_fin DATE,
    activa BOOLEAN DEFAULT TRUE
);

-- TABLA: comparador_precios
CREATE TABLE comparador_precios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    competidor VARCHAR(100),
    precio_competidor DECIMAL(10,2),
    fecha_consulta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- TABLA: conversion_divisas
CREATE TABLE conversion_divisas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    moneda_origen VARCHAR(10) NOT NULL,
    moneda_destino VARCHAR(10) NOT NULL,
    tasa DECIMAL(10,4) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: envios
CREATE TABLE envios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    direccion_envio TEXT NOT NULL,
    estado_envio ENUM('EN_PREPARACION', 'DESPACHADO', 'ENTREGADO', 'CANCELADO') DEFAULT 'EN_PREPARACION',
    proveedor_transporte VARCHAR(100),
    tracking_url VARCHAR(255),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- TABLA: logs (auditoría)
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    accion VARCHAR(255),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    detalles TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


-- DATOS FICTICIOS

-- INSERTS PARA USUARIOS
INSERT INTO usuarios (nombre, apellido, email, password, rut, telefono, rol)
VALUES 
('Carla', 'Gómez', 'carla@ferremas.cl', 'hashed123', '12345678-9', '987654321', 'administrador'),
('Juan', 'Pérez', 'juan@ferremas.cl', 'hashed123', '11111111-1', '912345678', 'vendedor'),
('Lucía', 'Rojas', 'lucia@ferremas.cl', 'hashed123', '22222222-2', '923456789', 'bodeguero'),
('Marco', 'Díaz', 'marco@ferremas.cl', 'hashed123', '33333333-3', '934567890', 'contador');

-- INSERTS PARA CLIENTES
INSERT INTO clientes (nombre, apellido, rut, correo_electronico, telefono)
VALUES 
('Paloma', 'Tamayo', '98765432-1', 'paloma@gmail.com', '912345678'),
('Cristian', 'Solis', '87654321-2', 'cristian@gmail.com', '923456789');

-- INSERTS PARA CATEGORÍAS Y MARCAS
INSERT INTO categorias (nombre, descripcion) VALUES 
('Herramientas', 'Herramientas de mano y eléctricas'),
('Materiales de Construcción', 'Cemento, madera, ladrillos');

INSERT INTO marcas (nombre, descripcion) VALUES 
('Bosch', 'Herramientas eléctricas alemanas'),
('Makita', 'Marca japonesa de herramientas');

-- INSERTS PARA PRODUCTOS
INSERT INTO productos (codigo, nombre, descripcion, precio, categoria_id, marca_id, imagen_url, especificaciones)
VALUES
('P001', 'Taladro Percutor Bosch', 'Taladro de alta potencia', 59990, 1, 1, NULL, 'Potencia: 700W'),
('P002', 'Sierra Circular Makita', 'Corte rápido y preciso', 89990, 1, 2, NULL, 'Disco: 7 1/4"');

-- INSERTS PARA SUCURSALES
INSERT INTO sucursales (nombre, direccion, region, comuna) VALUES 
('Sucursal Central', 'Av. Principal 123', 'Región Metropolitana', 'Santiago'),
('Sucursal Sur', 'Ruta 5 Sur km 1000', 'Los Lagos', 'Puerto Montt');

-- INVENTARIO
INSERT INTO inventario (producto_id, sucursal_id, stock) VALUES 
(1, 1, 25),
(2, 1, 10),
(1, 2, 15),
(2, 2, 5);

-- DIRECCIONES
INSERT INTO direcciones (usuario_id, calle, numero, comuna, region, es_principal)
VALUES 
(1, 'Av. Las Flores', '123', 'Santiago', 'Región Metropolitana', TRUE),
(2, 'Calle Los Álamos', '456', 'Puerto Montt', 'Los Lagos', TRUE);


-- MÁS DATOS FICTICIOS

-- PEDIDOS
INSERT INTO pedidos (cliente_id, estado, total)
VALUES
(1, 'PENDIENTE', 149980),
(2, 'PAGADO', 59990);

-- PEDIDO ITEMS
INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
VALUES
(1, 1, 2, 59990, 119980),
(1, 2, 1, 30000, 30000),
(2, 1, 1, 59990, 59990);

-- PAGOS
INSERT INTO pagos (pedido_id, monto, estado, metodo_pago, transaccion_id, token_pasarela)
VALUES
(2, 59990, 'COMPLETADO', 'MERCADOPAGO', 'TRX12345', 'TOKEN12345'),
(1, 149980, 'PENDIENTE', 'MERCADOPAGO', NULL, NULL);

-- ENVÍOS
INSERT INTO envios (pedido_id, direccion_envio, estado_envio, proveedor_transporte, tracking_url)
VALUES
(2, 'Av. Las Flores 123, Santiago', 'DESPACHADO', 'Chilexpress', 'https://tracking.chilexpress.cl/TRX12345');

-- CARRITO
INSERT INTO carrito (cliente_id, producto_id, cantidad, precio_unitario)
VALUES
(1, 2, 2, 89990),
(2, 1, 1, 59990);

-- PROMOCIONES
INSERT INTO promociones (nombre, descripcion, porcentaje_descuento, fecha_inicio, fecha_fin)
VALUES
('Descuento Primavera', '10% en herramientas seleccionadas', 10.0, '2025-09-01', '2025-09-30'),
('Black Friday', '30% en toda la tienda', 30.0, '2025-11-25', '2025-11-30');

-- COMPARADOR DE PRECIOS
INSERT INTO comparador_precios (producto_id, competidor, precio_competidor)
VALUES
(1, 'Sodimac', 62000),
(2, 'Imperial', 91000);

-- CONVERSION DIVISAS
INSERT INTO conversion_divisas (moneda_origen, moneda_destino, tasa)
VALUES
('CLP', 'USD', 970.00),
('CLP', 'EUR', 1045.00);
