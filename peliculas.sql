DROP database if exists videoclub;

CREATE DATABASE videoclub;
USE videoclub;
CREATE TABLE Peliculas (
	Id_pelicula INT NOT NULL auto_increment primary key,
	titulo VARCHAR(60) NOT NULL,
	fecha_tit INT,
	critica TEXT,
	caratula blob
);
CREATE TABLE copias(
	n_copia INT NOT NULL auto_increment primary key,
	deteriorada VARCHAR(10),
	formato VARCHAR(10) NOT NULL,
	Id_pelicula INT NOT NULL,
	precio_alquiler INT,
    foreign key (Id_pelicula) REFERENCES Peliculas (Id_pelicula)
);
#UN es Unique: es un valor unico e irrepetible
#NN es NOT NULL
CREATE TABLE clientes (
	cod_cliente INT NOT NULL auto_increment primary key,
    dni INT UNIQUE,
    nombre VARCHAR (60) NOT NULL,
    apellido1 VARCHAR (20) NOT NULL,
    apellido2 VARCHAR (20) NOT NULL,
    direccion VARCHAR (40),
	email VARCHAR (40) UNIQUE
);

CREATE TABLE prestamos (
	id_prestamo INT NOT NULL auto_increment,
    fecha_prestamo DATE NOT NULL,
    fecha_tope DATE,
    fecha_entrega DATE,
    cod_cliente INT,
    n_copia INT,
    
    PRIMARY KEY (id_prestamo, n_copia, cod_cliente),
    foreign key (cod_cliente) REFERENCES clientes (cod_cliente),
    foreign key (n_copia) REFERENCES copias (n_copia)
);
GRANT FILE ON *.* TO 'root'@'localhost';
INSERT INTO Peliculas (titulo,fecha_tit,critica,caratula) VALUES
('El señor de los anillos: el retorno del rey', '2003', 'Frodo, Sam y Gollum se acercan al monte del Destino, donde destruirán el anillo o perecerán en el intento. Mientras, Aragorn y sus compañeros se enfrentan a las monstruosas tropas de Sauron.', load_file('Proyecto_6\Imagenes\LOTR.jpg')),
('Avengers: Endgame','2019','Los Vengadores restantes deben encontrar una manera de recuperar a sus aliados para un enfrentamiento épico con Thanos, el malvado que diezmó el planeta y el universo.', load_file('Proyecto_6\Imagenes\Avengers.jpg')),
('Rápido y furioso', '2001','Un policía encubierto se infiltra en una banda de carreras callejeras de Los Ángeles mientras investiga robos de automóviles.',load_file('Proyecto_6\Imagenes\rapidos.jpg'));

SELECT * FROM Peliculas;

