import Navegador from "./navegador";
import Select from 'react-select';
import {  useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react";




const dip = process.env.DIP; 

export function EditarAlbum() {

  


  const usuarioAlmacenado = JSON.parse(localStorage.getItem("Usuario"))

  //Datos para el album
  const [Nombre, setInputValue] = useState("");
  const [Album, setAlbumSeleccionado] = useState('');

  const handleNameChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleAlbumChange = (e) => {
    setAlbumSeleccionado(e.value)
  }


  //Modificacion de albumes
  const CrearAlbum = async (e) => {

    let path = usuarioAlmacenado.user + "/" + Nombre
    let user = usuarioAlmacenado.user
    console.log(path)

    try {
      const response = await fetch('http://'+dip+'/crearAlbum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: Nombre, user: user }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      console.log(result.mensaje)
      window.location.reload();

    } catch (error) {
      console.error('Error al enviar el nombre:', error);
    }

  }

  const ModificarAlbum = async (e) => {

    let oldPath = usuarioAlmacenado.user + "/" + Album
    let newPath = usuarioAlmacenado.user + "/" + Nombre
    let user = usuarioAlmacenado.user
    try {
      const response = await fetch('http://'+dip+'/modificarAlbum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user, oldPath: Album, newPath: Nombre }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      console.log(result.mensaje)
      window.location.reload();

    } catch (error) {
      console.error('Error al enviar el nombre:', error);
    }
  }

  const EliminarAlbum = async (e) => {
    let user = usuarioAlmacenado.user
    let path = Album
    try {
      const response = await fetch('http://'+dip+'/eliminarAlbum', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user, path: path }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      console.log(result.mensaje)
      window.location.reload();
    } catch (error) {
      console.error('Error al enviar el nombre:', error);
    }

  }



  //Albumes
  const [datos, setDatos] = useState([]); // Use useState for initial empty array

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch('http://'+dip+'/ObtenerAlbumes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setDatos(data.albumes); // Update state with received albumes
      } catch (error) {
        console.error('Error al enviar el nombre:', error);
      }
    };

    obtenerDatos();
  }, []);

  // Ensure datos is defined before rendering the Select component:
  if (!datos) {
    return <div>Loading data...</div>; // Display a loading message
  }

  // Construct options for Select using map:
  const options = datos.map((album) => ({
    value: album, // Set value and label to the same album name
    label: album,
  }));

  return (
    <div>
      <Navegador></Navegador>

      <h1>Editar album</h1>
      <div className="contenedor">
        <textarea type="text" rows="1" column="50" value={Nombre} onChange={handleNameChange}></textarea> <br></br>
        <button onClick={CrearAlbum}>Agregar</button>
        <button onClick={ModificarAlbum}>Modificar</button> <br></br> <br></br>
        <br></br>
        <br></br>
        <div className="select">
          <Select options={options} onChange={handleAlbumChange} placeholder="Selecciona un álbum" />
        </div>
        <br></br>
        <button onClick={EliminarAlbum}>Eliminar</button>
      </div>

    </div>
  )

}

export default EditarAlbum