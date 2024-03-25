create database usuario;

use usuario;

create table usuario(
	nick varchar(50),
    nombre varchar(100),
    contra varchar(20),
    perfil varchar(100)
);

select * from usuario; 

insert into usuario (nick, nombre, contra) values ('mg','Ortega','123');

create table imagenes(
	nick varchar(255),
    album varchar(255),
    foto varchar(255),
    descripcion varchar(255)
);

INSERT INTO imagenes (usuario, album, foto, descripcion) values ( ' Usuario ',' AlbumNuevo ',' NombreNuevo ',' Descripcion ');
select * from imagenes;
SELECT * FROM imagenes WHERE foto ='Parrot';

ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '3191363100501';
