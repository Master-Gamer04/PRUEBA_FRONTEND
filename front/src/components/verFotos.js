import Navegador from './navegador';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
//import 'slick-carousel/slick/slick.css';
//import 'slick-carousel/slick/slick-theme.css';
import './estilo.css';
import DIP from './variables'


const dip = DIP.DIP; // process.env.REACT_APP_DIP; 

export function VerFotos() {

  const usuarioAlmacenado = JSON.parse(localStorage.getItem("Usuario"))

  const styles = {
    width: '300px',
    height: 'auto',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const [imagenes, setImagenes] = useState([]);
  const [imagenesPerfil, setImagenesPerfil] = useState([]);

  //Fotos
  //Albumes
  //const [datos, setDatos] = useState([]); // Use useState for initial empty array

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch('http://' + dip + '/ObtenerFotos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({nombre: usuarioAlmacenado.user}),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        setImagenes(data.albumes);

        //setDatos(data.albumes); // Update state with received albumes
      } catch (error) {
        console.error('Error al enviar el nombre:', error);
      }
    };

    const obtenerFotos = async () => {
      try {
        const response = await fetch('http://' + dip + '/ObtenerFotosPerfil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        setImagenesPerfil(data.albumes);

        //setDatos(data.albumes); // Update state with received albumes
      } catch (error) {
        console.error('Error al enviar el nombre:', error);
      }
    };
    //setDatos(data.albumes); // Update state with received albumes

    obtenerDatos();
    obtenerFotos();
  }, [usuarioAlmacenado]);



  return (
    <div>


      <Navegador></Navegador>
      
      <h1>Fotos publicadas</h1>
      <div className="carousel-container">
        {/* {imagenes.map((imagen) => (
          <img width={300} height={300} alt="Imagen proporcionada" key={imagen} src={imagen} />
        ))} */}
        {Object.keys(imagenes).map((album) => (
        <div key={album}>
          <h1>{album}</h1>
          <ul>
            {imagenes[album].map((imagen) => (
              <li key={imagen}>
                <img src={imagen} alt={album} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      </div>

      <h1>Fotos de perfil</h1>

      {imagenesPerfil.map((imagen) => (
        <img width={300} height={300} alt="Imagen proporcionada" key={imagen} src={imagen} />


      ))}

    </div>

  )




}


export default VerFotos;
