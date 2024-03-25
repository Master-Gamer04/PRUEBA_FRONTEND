import React, { useState, useEffect } from 'react';
import Navegador from './navegador';
import './estilo.css';
// import Select from 'react-select';
import Swal from 'sweetalert2';
import DIP from './variables'
const dip = DIP.DIP; // process.env.REACT_APP_DIP; 

export function SubirFotos() {

  let respuesta = ""

  const usuarioAlmacenado = JSON.parse(localStorage.getItem("Usuario"))


  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [albumSeleccionado, setAlbumSeleccionado] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleFileChange = (event) => {
    const foto = event.target.files[0];
    setFotoSeleccionada(foto);
  };

  const cargarFoto = () => {
    // Verificar si se seleccionó una foto
    if (fotoSeleccionada) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // Obtener la URL de la imagen
        const urlImagen = event.target.result;
        // Mostrar la imagen en un elemento de imagen o cualquier otro elemento de tu elección
        document.getElementById('imagenMostrada').src = urlImagen;
        document.getElementById('imagenMostrada').style.display = 'block';
      };
      // Leer el archivo como una URL de datos
      reader.readAsDataURL(fotoSeleccionada);
    } else {
      console.log("No se ha seleccionado ninguna foto.");
    }

  };



  // const handleAlbumChange = (selectedAlbum) => {

  //   setAlbumSeleccionado(selectedAlbum.value);
  // };


  const handleNombreChange = (event) => {
    console.log("haciendo cambio de nombre")
    setNombre(event.target.value);
  };

  const handleDescripcionChange = (event) => {
    console.log("haciendo cambio de Descripcion")
    setDescripcion(event.target.value);
  };

  const handleSubmit = async (e) => {

    const data = {
      nombre,
      foto: fotoSeleccionada, // Asumir que se ha convertido a base64 o similar
      descripcion,
    };

    try {
      const response = await fetch('http://' + dip + '/subirFoto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreOriginal: fotoSeleccionada.name, nombreNuevo: data.nombre, usuario: usuarioAlmacenado.user, descripcion: data.descripcion}),
      });

      const formData = new FormData();
      formData.append('imagen', fotoSeleccionada);
      fetch('http://' + dip + '/subir-imagen', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('URL pública de la imagen en S3:', data.url);
        })
        .catch(error => {
          console.error('Error al subir la imagen:', error);
        });


      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();


      respuesta = result.mensaje
      console.log(respuesta)
      Swal.fire({
        title: 'Success!',
        html: 'Foto subida correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
      //Manejar logica del resultado de la api

    } catch (error) {
      console.error('Error al enviar el nombre:', error);
    }



    // Enviar la data a un servidor
    console.log("Enviando data:", data);
  };


  //Albumes
  // const [datos, setDatos] = useState([]); // Use useState for initial empty array

  // useEffect(() => {
  //   const obtenerDatos = async () => {
  //     try {
  //       const response = await fetch('http://' + dip + '/ObtenerAlbumes', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       setDatos(data.albumes); // Update state with received albumes
  //     } catch (error) {
  //       console.error('Error al enviar el nombre:', error);
  //     }
  //   };

  //   obtenerDatos();
  // }, []);

  // // Ensure datos is defined before rendering the Select component:
  // if (!datos) {
  //   return <div>Loading data...</div>; // Display a loading message
  // }

  // // Construct options for Select using map:
  // const options = datos.map((album) => ({
  //   value: album, // Set value and label to the same album name
  //   label: album,
  // }));

  return (
    <>
      <Navegador />

      <h1>Subir Foto</h1>
      <div className="subirFotos">
        <div className="izquierda">
          <br></br>
          <br></br>
          <p><strong>Nombre de la foto</strong></p>
          <textarea id="nombre" name="nombre" rows="1" cols="50" onChange={handleNombreChange} />
          <br></br>
          <br></br>
          <p><strong>Descripcion</strong></p>
          <textarea id="nombre" name="nombre" rows="10" cols="50" onChange={handleDescripcionChange} />
          <br></br>
          <br></br>
          {/* <p><strong>Album</strong></p>
          <div className="select">
            <Select options={options} onChange={handleAlbumChange} placeholder="Selecciona un álbum" />
          </div> */}
          <br></br>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <br></br>
          <button onClick={cargarFoto}>Cargar foto</button>
          <button onClick={handleSubmit}>Enviar</button>
        </div>
        <div className="derecha">
          <p><strong>Imagen</strong></p>
          <img id="imagenMostrada" style={{ display: 'none', maxWidth: '100%' }} alt="Foto" />
        </div>
      </div>
      <p>{respuesta}</p>
    </>
  );
}

export default SubirFotos;
