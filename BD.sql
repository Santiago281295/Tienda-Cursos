CREATE TABLE Usuarios(
	IDUsuario	INT AUTO_INCREMENT PRIMARY KEY,
    Nombre		VARCHAR(250),
    Apellido	VARCHAR(250),
    Correo		VARCHAR(75),
    Contrasena	VARCHAR(75),
    Foto		VARCHAR(250),
    TipoUsu		VARCHAR(1000),
    Cliente		BIT,
    Status		BIT
);

CREATE TABLE Productos(
	IDProducto	INT AUTO_INCREMENT PRIMARY KEY,
    Titulo		VARCHAR(250),
    Descripcion	VARCHAR(1000),
    Precio		FLOAT,
    Stock		INT,
    Imagen		VARCHAR(1000),
    Libro       VARCHAR(1000),
    Tecnologia	VARCHAR(250),
    Autor		VARCHAR(250),
    Link		LONGTEXT,
    TotVendidos	INT,
    Status		BIT
);

CREATE TABLE Configuracion(
	IDConfig	INT AUTO_INCREMENT PRIMARY KEY,
    Mision		VARCHAR(1000),
    Vision		VARCHAR(1000),
    AcercaDe	VARCHAR(1000),
    Status		BIT
);

CREATE TABLE ComentariosProductos(
	IDComent	INT AUTO_INCREMENT PRIMARY KEY,
    Comentario	VARCHAR(1000),
    FKUsuario	INT,
    FKProducto	INT,
    FOREIGN KEY(FKUsuario) REFERENCES Usuarios(IDUsuario),
    FOREIGN KEY(FKProducto) REFERENCES Productos(IDProducto)
);

CREATE TABLE Bitacora(
	IDBitacora	INT AUTO_INCREMENT PRIMARY KEY,
    Cantidad	INT,
    Fecha		DATE,
    FKProducto	INT,
    FOREIGN KEY(FKProducto) REFERENCES Productos(IDProducto)
);

CREATE TABLE Carrito(
	IDCarrito	INT AUTO_INCREMENT PRIMARY KEY,
    Cantidad	INT,
    FKProducto	INT,
    FKUsuario	INT,
    FOREIGN KEY(FKProducto) REFERENCES Productos(IDProducto),
    FOREIGN KEY(FKUsuario) REFERENCES Usuarios(IDUsuario)
);

CREATE TABLE ProductosUsuario(
    IDProdUsu	INT AUTO_INCREMENT PRIMARY KEY,
    FKUsuario	INT,
    FKProducto	INT,
    FOREIGN KEY(FKUsuario) REFERENCES Usuarios(IDUsuario),
    FOREIGN KEY(FKProducto) REFERENCES Productos(IDProducto)
);

INSERT INTO Usuarios (Nombre, Apellido, Correo, Contrasena, Foto, TipoUsu, Cliente, Status) VALUES ('Aurelio', 'Mex Mex', 'aurelio16.mex@gmail.com', 'aureliomex', 'default.png', 'Administrador', 0, 1);