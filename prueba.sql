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

ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '3191363100501';
