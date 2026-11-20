-- tabla de categorias
CREATE TABLE categorias (
    id VARCHAR(30) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_categorias_nombre UNIQUE (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- tabla de productos con reglas de precio, oferta y stock
CREATE TABLE productos (
    id VARCHAR(20) NOT NULL,
    categoria_id VARCHAR(30) NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    precio DECIMAL(19,0) NOT NULL,
    precio_oferta DECIMAL(19,0) NULL,
    stock INT NOT NULL,
    unidad VARCHAR(50) NOT NULL,
    origen VARCHAR(100) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id),
    CONSTRAINT ck_productos_precio CHECK (precio > 0),
    CONSTRAINT ck_productos_oferta CHECK (precio_oferta IS NULL OR (precio_oferta > 0 AND precio_oferta < precio)),
    CONSTRAINT ck_productos_stock CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
