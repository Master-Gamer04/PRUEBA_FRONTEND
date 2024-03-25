const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const mysql = require('mysql');
require('dotenv').config();
const sharp = require('sharp');
const fs = require('fs');

const cors = require('cors'); // Asegúrate de instalar el paquete cors si quieres manejar CORS
const { Console } = require('console');

const accessKeyId = process.env.ACCESO;
const secretAccessKey = process.env.ACCESO_SECRETO;

//BASe de datos
const host = process.env.HOST;
const user = 'admin';
const password = process.env.PASSWORD;

const bucketName = "practica1-g6-imagenes1"


const app = express();
const port = 5000;


// Configuración de la conexión a RDS en AWS
const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: 'prueba',
  port: 3306, // El puerto por defecto para MySQL es 3306
});

console.log("Datos de conexion", host, user, password)

let Usuario = ""
let NombreNuevo = ""
let Descripcion = ""
// Configuración de Rekognition
const params_ = {
  SimilarityThreshold: 80,
};
var rekognition = new AWS.Rekognition({
  accessKeyId: process.env.ACCESO_REKOGNITION,
  secretAccessKey: process.env.ACCESO_SECRETO_REKOGNITION,
  region: process.env.REGION_REKOGNITION, // por ejemplo, 'us-east-1'
});

// Configuración de Express

app.use(cors()); // Permite solicitudes de origen cruzado
app.use(express.json()); // Para parsear solicitudes JSON

//Balanceador
app.get("/cheque", (req, res) => {
  res.status(200).send('Si estas aqui, es porque todo esta OK!');
})

// Configura AWS
const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: "us-east-2"
});

// Configura multer para manejar la carga de archivos
const upload = multer({ dest: 'uploads/' });

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos con el ID:', connection.threadId);
});

// ... Tu lógica de aplicación aquí ...
connection.query('SELECT * FROM prueba', (err, rows) => {
  if (err) throw err;

  console.log('Data received from Db:');
  console.log(rows);
});

// ... Tu lógica de aplicación aquí ...
connection.query('SELECT * FROM prueba WHERE nick = "guicho"', (err, rows) => {
  if (err) throw err;

  console.log('Data received from Db:');
  console.log(rows[0]);
});


app.get('/', (peticion, respuesta) => {
  // Podemos acceder a la petición HTTP
  let agenteDeUsuario = peticion.header("user-agent");
  respuesta.send("La ruta / solicitada con: " + agenteDeUsuario);
});


app.post("/login", async (req, res) => {
  //Obtener el user y password
  const { user } = req.body
  const { password } = req.body

  //Buscar en base de datos y obtener el nombre completo y foto
  const nombre = "Luis Enrique"

  //Verificar que existe
  connection.query('SELECT * FROM prueba WHERE nick = "' + user + '"', async (err, rows) => {
    if (err) throw err;

    console.log('Data received from Db:');

    if (0 != rows.length) {
      // console.log(rows[0]);
      let user_db = rows[0].nick
      let nombre_db = rows[0].nombre
      let foto_db = rows[0].perfil
      // console.log("comparacion de contras")
      // console.log(password)
      // console.log(rows[0].contra)

      if (password == rows[0].contra) {
        var labels = await detect_faces("Fotos_Perfil/" + user + ".jpg")
        var FaceDetails = labels.FaceDetails[0]
        var labelsString = " Age: " + FaceDetails.AgeRange.Low + " - " + FaceDetails.AgeRange.High + "\n"
        labelsString += "Genero: " + FaceDetails.Gender.Value + "\n"
        labelsString += FaceDetails.Beard.Value ? "Tiene barba\n" : ""
        labelsString += FaceDetails.Eyeglasses.Value ? "Usa lentes\n" : ""
        labelsString += FaceDetails.EyesOpen.Value ? "Ojos abiertos\n" : "Ojos cerrados\n"
        labelsString += FaceDetails.Mustache.Value ? "Tiene bigote\n" : ""
        labelsString += FaceDetails.Smile.Value ? "Sonrie\n" : "No sonrie\n"
        res.send({ mensaje: "Existe", usuario: user_db, nombre_completo: nombre_db, foto: foto_db, labels: labelsString })

      } else {
        res.send({ mensaje: "No existe" })

      }
    } else {
      res.send({ mensaje: "No existe" })
    }

  });
});
app.post("/loginCamara", async (req, res) => {
  const { mensaje } = req.body
  const { foto } = req.body

  console.log("Datos login camara")

  const params = {
    Bucket: 'practica1-g6-imagenes1',
    Key: "Fotos_Perfil/"
  };

  fotoTarget = Buffer.from(foto.split(",")[1], "base64")
  const pngBuffer = await sharp(fotoTarget)
    .toFormat('png')
    .toBuffer();
  const params_dectect_face_entrante = {
    Image: {
      Bytes: pngBuffer
    },
  };
  let carasEntrante = await rekognition.detectFaces(params_dectect_face_entrante).promise();
  
  if (carasEntrante.FaceDetails.length > 0) {

    s3.listObjectsV2({ Bucket: params.Bucket, Prefix: params.Key }, async (err, data) => {
      if (err) {
        console.error('Error al listar objetos:', err);

        return;
      }
      let fotosRef = [];
      const folders = data.Contents.filter((object) => object.Key.endsWith('.jpg'));
      
      // Recorre la lista de carpetas y elimínalas

      for (let i = 0; i < folders.length; i++) {
        const folder = folders[i];
        // Perform actions on each folder here, e.g.,

        let requestBucket = {
          Bucket: "practica1-g6-imagenes1",
          Key: folder.Key,
        };
        let fotografia = await s3.getObject(requestBucket).promise();

        const bufferFoto = Buffer.from(fotografia.Body.toString('base64').split(",")[0], 'base64');

        const params_compare_faces = {
          SimilarityThreshold: 80,
          SourceImage: {
            Bytes: bufferFoto
          },
          TargetImage: {
            Bytes: pngBuffer
          }
        };
        // const params_dectect_face_Bucket = {
        //   Image: {
        //     Bytes: bufferFoto
        //   },
        // };

        // let caras = await rekognition.detectFaces(params_dectect_face_Bucket).promise();

        // console.log(caras, carasEntrante);
        if (true) {
          let compareResponse = await rekognition.compareFaces(params_compare_faces).promise();
          
          if (compareResponse.FaceMatches.length > 0) {
            
            if (compareResponse.FaceMatches[0].Similarity > 80) {
              var perfil = folder.Key.split("/")[1].split(".")[0];
              console.log('perfil',perfil)
              connection.query('SELECT * FROM prueba WHERE nick = "' + perfil + '"', async (err, rows) => {
                if (err) throw err;
              console.log('entro-----------------',rows)
                if (0 != rows.length) {
                  let user_db = rows[0].nick
                  let nombre_db = rows[0].nombre
                  let foto_db = rows[0].perfil
                  let Contraseña = rows[0].contra
                  var labels = await detect_faces(folder.Key)
                  var FaceDetails = labels.FaceDetails[0]
                  var labelsString = " Age: " + FaceDetails.AgeRange.Low + " - " + FaceDetails.AgeRange.High + "\n"
                  labelsString += "Genero: " + FaceDetails.Gender.Value + "\n"
                  labelsString += FaceDetails.Beard.Value ? "Tiene barba\n" : ""
                  labelsString += FaceDetails.Eyeglasses.Value ? "Usa lentes\n" : ""
                  labelsString += FaceDetails.EyesOpen.Value ? "Ojos abiertos\n" : "Ojos cerrados\n"
                  labelsString += FaceDetails.Mustache.Value ? "Tiene bigote\n" : ""
                  labelsString += FaceDetails.Smile.Value ? "Sonrie\n" : "No sonrie\n"
                  res.send({ mensaje: "Existe", usuario: user_db, nombre_completo: nombre_db, foto: foto_db, password: Contraseña, labels: labelsString })
                } else {
                  res.send({ mensaje: "No existe" })
                }
              });
              break;
            }
          }
        }
      }

    });
  } else {
    res.send({ mensaje: "No hay caras" })
  }
})

app.post("/registro", (req, res) => {

  //Obtener datos, foto es url
  const { Name, User, Foto, Password } = req.body
  console.log("Datos registro")

  connection.query('SELECT * FROM prueba WHERE nick = "' + User + '"', (err, rows) => {

    if (err) throw err;
    if (0 != rows.length) {
      res.send({ Mensaje: "Existe" })

    }
    else {
      let url = "Fotos_Perfil/" + User + ".jpg"

      Usuario = User

      const values = "'" + User + "','" + Name + "','" + Password + "','" + url + "'"


      connection.query("INSERT INTO prueba (nick, nombre, contra, perfil) values (" + values + ");")

      //Guardar en base de datos

      res.send({ Mensaje: "Correcto" });
    }


  });



})

app.post("/editarPerfil", (req, res) => {

  //Obtener datos
  let { User } = req.body
  let { Nombre } = req.body
  let { Foto } = req.body
  let { oldUser } = req.body

  let url = "Fotos_Perfil/" + User + ".jpg"

  Usuario = User


  //Buscar user en base de datos
  connection.query("UPDATE prueba set nick='" + User + "',nombre ='" + Nombre + "', perfil ='" + url + "' where nick = '" + oldUser + "';")




  console.log("Datos para editar perfil")
  console.log(User, Nombre, Foto, oldUser)

  //Si coinciden se actualizan datos

  res.send({ mensaje: "Correcto", user: User, nombre: Nombre, foto: url })

})

app.post("/subirFoto", (req, res) => {
  //Obtener datos

  let { nombreOriginal } = req.body
  let { nombreNuevo } = req.body
  let { usuario } = req.body
  let { descripcion } = req.body
  NombreNuevo = nombreNuevo
  Usuario = usuario
  Descripcion = descripcion

  //Extraer la extension y crear nuevo nombre
  const extension = nombreOriginal.split(".")
  let nuevoNombre = nombreNuevo + "." + extension[1]

  //Crear path + album
  let path = usuario + "/" + "/" + nuevoNombre

  //subir al bucket

  //Subir a la base de datos


  console.log("datos")
  console.log(path)
  console.log(nuevoNombre)




  //Subir foto a la base

  res.send({ mensaje: "Se subio la foto correctamente" })
})

app.post("/crearAlbum", (req, res) => {
  //Obtener path
  let { path } = req.body
  let { user } = req.body
  console.log("Datos crear album")
  console.log(path)
  console.log(user)
  //subir al s3
  const params = {
    Bucket: 'practica1-g6-imagenes1',
    Key: "Fotos_Publicadas/" + path + "/",
    Body: path,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error al subir la imagen a S3:', err);
      return res.status(500).json({ error: 'Error al subir la imagen a S3' }); // Use `return` to exit the function after sending the error response
    }

    console.log('Imagen subida con éxito. URL pública:', data.Location);

    // Single response based on upload success
    res.json({ url: data.Location });
  });


  //Subir a la base de datos
  //res.send({mensaje: "Se creo el album correctamente"})


})

app.post("/modificarAlbum", (req, res) => {

  let { oldPath, newPath, user } = req.body

  const params = {
    Bucket: bucketName, // Reemplaza con el nombre de tu bucket
    CopySource: `Fotos_Publicadas/Personas/`, // Ruta completa de la carpeta actual (con nombre)
    Key: `Fotos_Publicadas/Mascotas/`, // Ruta completa de la carpeta con el nuevo nombre
  };

  s3.copyObject(params, (err, data) => {
    if (err) {
      console.error('Error al copiar la carpeta:', err);
    } else {
      console.log('Carpeta renombrada con éxito:', data);
    }
    res.json({ url: data });
  });

  console.log("Datos para modificar album")
  console.log(oldPath)
  console.log(newPath)
  console.log(user)



  //Modificar el nombre del album

  //res.send({mensaje: "Se modifico el album correctamente"})
})

app.delete("/eliminarAlbum", (req, res) => {
  let { user, path } = req.body

  console.log("Datos para eliminar album")
  console.log(user)
  console.log(path)

  const params = {
    Bucket: 'practica1-g6-imagenes1',
    Key: "Fotos_Publicadas/" + path,
  };

  // Lista todos los objetos en la carpeta
  s3.listObjectsV2({ Bucket: params.Bucket, Prefix: params.Key }, (err, data) => {
    if (err) {
      console.error('Error al listar objetos:', err);
      return;
    }

    // Recorre la lista de objetos y elimínalos
    data.Contents.forEach((object) => {
      s3.deleteObject({ Bucket: params.Bucket, Key: object.Key }, (deleteErr, deleteData) => {
        if (deleteErr) {
          console.error('Error al eliminar objeto:', deleteErr);
        } else {
          console.log('Objeto eliminado:', deleteData);
        }
      });
    });
  });

  //logica para base


  s3.deleteObject(params).promise();
  console.log('Objeto eliminado correctamente.');





  //Buscar album por nombre

  //Eliminar toodo

  res.send({ mensaje: "Album eliminado correctamente" })
})

app.get("/ObtenerFotosPerfil", (req, res) => {
  let Fotos = []

  const params = {
    Bucket: 'practica1-g6-imagenes1',
    Key: "Fotos_Perfil/",
  };

  // Lista los objetos en la carpeta Fotos_Publicadas
  s3.listObjectsV2({ Bucket: params.Bucket, Prefix: params.Key }, (err, data) => {
    if (err) {
      console.error('Error al listar objetos:', err);

      return;
    }
    let fotosRef = [];


    // Filtra solo los objetos que representan carpetas
    const folders = data.Contents.filter((object) => object.Key.endsWith('.jpg'));

    // Recorre la lista de carpetas y elimínalas
    console.log("--Fotos perfil--")


    for (let i = 0; i < folders.length; i++) {
      const folder = folders[i];

      // Perform actions on each folder here, e.g.,
      console.log(folder.Key);
      fotosRef.push("https://practica1-g6-imagenes1.s3.us-east-2.amazonaws.com/" + folder.Key);


    }


    const uniqueArray = fotosRef.reduce((acc, element) => {
      if (!acc.hasOwnProperty(element)) {
        acc[element] = true;
      }
      return acc;
    }, {})

    let Fotos = Object.keys(uniqueArray)

    console.log(Fotos)



    res.send({ albumes: Fotos })





  });



})

app.post("/ObtenerFotos", (req, res) => {
  let Fotos = []
  let Albumes = {}
  let { nombre } = req.body
  connection.query('SELECT * FROM imagenes WHERE nick = "' + nombre + '"', async (err, rows) => {
    if (err) throw err;
    if (0 != rows.length) {

      for (let i = 0; i < rows.length; i++) {
        Fotos.push("https://practica1-g6-imagenes1.s3.us-east-2.amazonaws.com/Fotos_Publicadas/" + nombre + "/" + rows[i].album + "/" + rows[i].foto + ".jpg")
        if (Object.keys(Albumes).includes(rows[i].album)) {
          Albumes[rows[i].album].push("https://practica1-g6-imagenes1.s3.us-east-2.amazonaws.com/Fotos_Publicadas/" + nombre + "/" + rows[i].album + "/" + rows[i].foto + ".jpg")
        } else {
          console.log(rows[i].album)
          Albumes[rows[i].album] = []
          Albumes[rows[i].album].push("https://practica1-g6-imagenes1.s3.us-east-2.amazonaws.com/Fotos_Publicadas/" + nombre + "/" + rows[i].album + "/" + rows[i].foto + ".jpg")
        }
      }
      console.log(Albumes)
      res.send({ albumes: Albumes })
    } else {
      res.send({ albumes: "No hay albumes" })
    }
  });
  // const params = {
  //   Bucket: 'practica1-g6-imagenes1',
  //   Key: "Fotos_Publicadas/" + nombre + "/",
  // };

  // // Lista los objetos en la carpeta Fotos_Publicadas
  // s3.listObjectsV2({ Bucket: params.Bucket, Prefix: params.Key }, (err, data) => {
  //   if (err) {
  //     console.error('Error al listar objetos:', err);

  //     return;
  //   }
  //   let fotosRef = [];


  //   // Filtra solo los objetos que representan carpetas
  //   const folders = data.Contents.filter((object) => object.Key.endsWith('.jpg'));

  //   // Recorre la lista de carpetas y elimínalas
  //   console.log("--Fotos--")


  //   for (let i = 0; i < folders.length; i++) {
  //     const folder = folders[i];

  //     // Perform actions on each folder here, e.g.,
  //     console.log(folder.Key);
  //     fotosRef.push("https://practica1-g6-imagenes1.s3.us-east-2.amazonaws.com/" + folder.Key);


  //   }


  //   const uniqueArray = fotosRef.reduce((acc, element) => {
  //     if (!acc.hasOwnProperty(element)) {
  //       acc[element] = true;
  //     }
  //     return acc;
  //   }, {})

  //   let Fotos = Object.keys(uniqueArray)

  //   console.log(Fotos)

  //   res.send({ albumes: Fotos })

  // });

})

app.get("/ObtenerAlbumes", (req, res) => {

  let Albumes = []

  const params = {
    Bucket: 'practica1-g6-imagenes1',
    Key: "Fotos_Publicadas/",
  };

  // Lista los objetos en la carpeta Fotos_Publicadas
  s3.listObjectsV2({ Bucket: params.Bucket, Prefix: params.Key }, (err, data) => {
    if (err) {
      console.error('Error al listar objetos:', err);

      return;
    }
    let albumesCopiaRef = [];


    // Filtra solo los objetos que representan carpetas
    const folders = data.Contents.filter((object) => object.Key.startsWith('Fotos_Publicadas/'));

    // Recorre la lista de carpetas y elimínalas
    console.log("--Folders--")



    for (let i = 0; i < folders.length; i++) {
      const folder = folders[i];
      // Perform actions on each folder here, e.g.,
      console.log(folder.Key);
      let nombre_carpeta = folder.Key.split("/")
      albumesCopiaRef.push(nombre_carpeta[1])

    }


    //folders.forEach((folder) => {
    //  s3.listObjectsV2({Bucket: params.Bucket, Prefix: params.Key}, (listErr, listData) => {
    //    if (listErr) {
    //      console.error("Error al listar los objetos en la carpeta:", listErr);
    //
    //    } else {
    //      
    //      let nombre_carpeta = folder.Key.split("/")
    //      
    //      albumesCopiaRef.push(nombre_carpeta[1]);
    //      
    //      
    //    }
    //  })
    //})

    const uniqueArray = albumesCopiaRef.reduce((acc, element) => {
      if (!acc.hasOwnProperty(element)) {
        acc[element] = true;
      }
      return acc;
    }, {});

    //console.log(Object.keys(uniqueArray));
    let Albumes = Object.keys(uniqueArray)
    res.send({ albumes: Albumes })





  });





})

app.post('/subir-foto-perfil', upload.single('imagen'), (req, res) => {
  const file = req.file;



  const params = {
    Bucket: 'practica1-g6-imagenes1',
    Key: "Fotos_Perfil/" + Usuario + ".jpg",
    Body: require('fs').createReadStream(file.path),
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error al subir la imagen a S3:', err);
      res.status(500).json({ error: 'Error al subir la imagen a S3' });
    } else {
      console.log('Imagen subida con éxito. URL pública:', data.Location);
      res.json({ url: data.Location });
    }
  });
});

app.post('/subir-imagen', upload.single('imagen'), async (req, res) => {

  connection.query('SELECT * FROM imagenes WHERE foto = "' + NombreNuevo + '"', async (err, rows) => {
    if (err) throw err;
    if (0 == rows.length) {
      const file = req.file;
      var byte = await leerArchivoYRetornarBytes(file.path)

      const params_animal = {
        Image: {
          Bytes: byte
        }
      }
      var err, detectLabels = await rekognition.detectLabels(params_animal).promise();
      if (err) {
        console.error('Error al subir la imagen a S3:', err);
        res.status(500).json({ error: 'Error al subir la imagen a S3' });
        return;
      }
      console.log(detectLabels.Labels)
      var albunes = ["Elephant", "Dog", "Cat", "Horse", "Human", "Person", "Parrot", "Bird", "Fish", "Tiger", "Lion", "Bear", "Monkey", "Giraffe", "Zebra", "Penguin", "Panda", "Koala", "Kangaroo", "Rabbit", "Squirrel", "Deer", "Wolf", "Fox", "Raccoon", "Hedgehog"]
      var AlbumNuevo = ""
      for (let i = 0; i < detectLabels.Labels.length; i++) {
        if (albunes.includes(detectLabels.Labels[i].Name)) {
          AlbumNuevo += detectLabels.Labels[i].Name
          break;
        }
      }
      console.log(AlbumNuevo)
      var bucketKey = "Fotos_Publicadas/" + Usuario + "/" + AlbumNuevo + "/" + NombreNuevo + ".jpg"
      const params = {
        Bucket: 'practica1-g6-imagenes1',
        Key: bucketKey,
        Body: require('fs').createReadStream(file.path),
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error al subir la imagen a S3:', err);
          res.status(500).json({ error: 'Error al subir la imagen a S3' });
        } else {
          const values = "'" + Usuario + "','" + AlbumNuevo + "','" + NombreNuevo + "','" + Descripcion + "'"
          connection.query("INSERT INTO imagenes (nick, album, foto, descripcion) values (" + values + ");")
          console.log('Imagen subida con éxito. URL pública:', data.Location);
          res.json({ url: data.Location });
        }
      });
    } else {
      res.send({ mensaje: "ya existe" })
    }

  });
});

function leerArchivoYRetornarBytes(filePath) {
  return new Promise((resolve, reject) => {
    // Leer el archivo
    fs.readFile(filePath, async (err, data) => {
      if (err) {
        reject(err); // Enviar el error si ocurre
        return;
      }
      // Convertir los datos en un búfer de bytes
      var bufferData = Buffer.from(data, 'bytes')
      var bufferData64 = bufferData.toString('base64')

      fotoTarget = Buffer.from(bufferData64, "base64")
      const pngBuffer = await sharp(fotoTarget)
        .toFormat('png')
        .toBuffer();

      // Resolver la promesa con los bytes
      resolve(pngBuffer);
    });
  });
}

app.post('/extraertexto', upload.single('imagen'), async (req, res) => {
  const file = req.file;
  var byte = await leerArchivoYRetornarBytes(file.path)

  const params = {
    Image: {
      Bytes: byte
    }
  };
  var detectText = await rekognition.detectText(params).promise();
  var detectTextArray = detectText.TextDetections;
  var detectTextArrayLinea = detectTextArray.filter((text) => text.Type === "LINE");
  var texto = ""
  for (let i = 0; i < detectTextArrayLinea.length; i++) {
    texto += "Linea " + i + " :" + detectTextArrayLinea[i].DetectedText + "\n"
  }
  res.send({ mensaje: "Correcto", texto: texto });
});

async function detect_labels(album, nombre) {
  let requestBucket = {
    Bucket: "practica1-g6-imagenes1",
    Key: nombre,
  };
  let fotografia = await s3.getObject(requestBucket).promise();
  const bufferFoto = Buffer.from(fotografia.Body.toString('base64').split(",")[0], 'base64');

  const params = {
    Image: {
      Bytes: bufferFoto
    },
  };
  var detectLabels = await rekognition.detectLabels(params).promise();
  return detectLabels;
}

async function detect_faces(nombre) {
  let requestBucket = {
    Bucket: "practica1-g6-imagenes1",
    Key: nombre,
  };
  let fotografia = await s3.getObject(requestBucket).promise();
  const bufferFoto = Buffer.from(fotografia.Body.toString('base64').split(",")[0], 'base64');

  const params = {
    Image: {
      Bytes: bufferFoto
    },
    Attributes: ["ALL"]
  };
  var detectFaces = await rekognition.detectFaces(params).promise();
  return detectFaces;
}

// for (var keys in FaceDetails) {
//   if (FaceDetails[keys] instanceof Object) {
//     labelsString += keys + ": " + "\n"
//     for (var keys2 in FaceDetails[keys]) {
//       if (FaceDetails[keys][keys2] instanceof Object) {
//         labelsString += keys2 + ": " + "\n"
//         for (var keys3 in FaceDetails[keys][keys2]) {
//           labelsString += keys3 + ": " + FaceDetails[keys][keys2][keys3] + "\n"
//         }
//       } else {
//         labelsString += keys2 + ": " + FaceDetails[keys][keys2] + "\n"
//       }
//     }
//   } else {
//     labelsString += keys + ": " + FaceDetails[keys] + "\n"
//   }
// }

// Cerrar la conexión al finalizar
//connection.end((err) => {
//  if (err) {
//    console.error('Error al cerrar la conexión:', err.stack);
//    return;
//  }
//  console.log('Conexión cerrada.');
//});

// Una vez definidas nuestras rutas podemos iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});