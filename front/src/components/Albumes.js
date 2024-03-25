import React, { useState, useEffect } from 'react';
import Select from 'react-select';



const dip = process.env.DIP; 

const Albumes = () => {
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

  // Render the Select component:
  return (
    <div>
      <Select options={options} placeholder="Selecciona un álbum" />
    </div>
  );
};

export default Albumes;
