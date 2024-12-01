use mystycrate;
CREATE TABLE productos_generales (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_producto VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10, 2),
    categoria VARCHAR(50),
    stock INT
);

CREATE TABLE productos_ropa (
    id_producto INT PRIMARY KEY,
    talla VARCHAR(10),
    color VARCHAR(50),
    material VARCHAR(50),
    FOREIGN KEY (id_producto) REFERENCES productos_generales(id_producto)
);

CREATE TABLE productos_belleza (
    id_producto INT PRIMARY KEY,
    tipo_piel VARCHAR(50),
    uso VARCHAR(50), -- Día/Noche
    ingredientes TEXT,
    FOREIGN KEY (id_producto) REFERENCES productos_generales(id_producto)
);

CREATE TABLE productos_golosinas (
    id_producto INT PRIMARY KEY,
    tipo_golosina VARCHAR(50),       -- Tipo de golosina: Chocolate, Goma de mascar, Caramelo
    sabor VARCHAR(50),               -- Sabor principal: Fresa, Limón, Chocolate
    contenido_calorico INT,          -- Cantidad de calorías por porción (en kcal)
    alergenos TEXT,                  -- Alérgenos presentes: Nueces, Lactosa, Gluten
    apto_para_veganos BOOLEAN,       -- Si es apto para veganos (TRUE/FALSE)
    fecha_expiracion DATE,           -- Fecha de vencimiento del producto
    FOREIGN KEY (id_producto) REFERENCES productos_generales(id_producto)
);

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    correo varchar(100),
    password varchar(255),
    fecha_nacimiento datetime,
    foto longblob
);

CREATE TABLE clientes (
	id_cliente INT PRIMARY KEY,
    Direccion TEXT,
    estado_suscripcion enum('Activa','Pausada','Cancelada')
);

CREATE TABLE planes (
	id_plan INT PRIMARY KEY auto_increment,
    nombre varchar(100),
    descripcion TEXT,
    precio INT,
    fecha_creacion timestamp
);

insert into planes (nombre, descripcion, precio)
VALUES ('Plan anual', 'Pagas por 4 cajas al año a un menor precio cada una, aparte recibes beneficios de personalizacion adicional', 219.99);

DELETE from usuarios where id_usuario = 1