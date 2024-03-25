# Manual de configuracion
## Integrantes
| Nombre | Carnet
|----------|----------
| Andre Joaquin Ortega De Paz    | 201900597   
| Luis Enrique Garcia Gutierrez    | 202010814  
| Erick Enrique González Chávez   | 201900621  


## Arquitectura utilizada
![](https://i.imgur.com/faEQOQz.jpeg)

# Pagina Web
Se realizo en el libreria de react de javascript.
Se aloja en bucket S3 publico para que pueda acceder en cualquier momento.
Este bucket lleva el nombre de practica1-g6-paginaweb1.

# Servidor
Es parte del backend. Se tiene un servidor programado en Nodejs. Se utilizo el SDK de aws.
Se creo una instancia de EC2. Se configura el Security group de la instancia únicamente con los puertos que necesite el servidor.

# Base de datos
Se utiliza el servicio de RDS.Se tiene una base de datos relacional usando mySql. La base de datos contiene toda la información necesaria para poder realizar las diferentes funciones de la página web.

Almacena la url donde está almacenada la imagen en el bucket de S3
La contraseña del usuario está Encriptada con el algoritmo MD5.

# Almacenamiento de Imágenes

Para alojar las imágenes tanto las de perfil como la de los diferentes álbumes se utiliza un bucket de S3 con el nombre practica1-G6-imágenes. Este tiene 2 carpetas en las cuales se almacenan las imágenes.Todas las fotos son públicas para que se puedan acceder desde la aplicación mediante la dirección url que proporciona el Bucket.

Las dos carpetas son:

Fotos_Perfil: Todas las fotos de perfil que se suban en la aplicación sin importar el usuario se almacenaran todas en esta carpeta.

Fotos_Publicadas: Se almacenarán todas las fotos sin importar álbum o usuario, todas las que sean cargadas desde la aplicación web.

## Usuarios IAM

# EC2
Se creo el usuario ec2 para la creacion de las instancia para el servidor. Este usuario tiene la politica de AmazonEC2FullAccess

# RDS
Se creo el usuario RDS para la creacion de la base de datos. Este usuario tiene la politica de AmazonRDSFullAccess.

# S3
Se creo el usuario S3 para el uso de los buckets para las imagenes y pagina web. Este usuario tiene la politica de Amazons3FullAcess

# Rekognition

Se creo el usuario UsuarioRekognition para el uso de amazon rekognition. Este usuario tiene la politica de AmazonRekognitionFullAcess, AmazonS3FullAccess y IAMFullAccess.



## Capturas

# S3
![](https://i.imgur.com/6hj6ysp.png)

# EC2
![](https://i.imgur.com/6hj6ysp.png)

# RDS
![](https://i.imgur.com/xDJcPsR.png)

# Rekognition
![](https://imgur.com/4bKMzfa.png)


# Aplicacion
![](https://imgur.com/Lu91M4Q.png)
![](https://imgur.com/KwJdQx6.png)
![](https://imgur.com/PkOk2MU.png)
![](https://imgur.com/hG0ZVGo.png)
![](https://imgur.com/HKt42PL.png)
![](https://imgur.com/6fNs5mH.png)
![](https://imgur.com/tFCwnAy.png)





