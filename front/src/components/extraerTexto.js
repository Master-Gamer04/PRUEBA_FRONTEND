import React, { useState } from 'react';
import Navegador from './navegador';
import './estilo.css';
import Swal from 'sweetalert2';
import DIP from './variables'
const dip = DIP.DIP; // process.env.REACT_APP_DIP; 

export function SubirFotos() {

    let respuesta = ""
    const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
    const [textoDetectado, setDextoDetectado] = useState('');

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




    const handleSubmit = async (e) => {
        if (fotoSeleccionada) {

        } else {
            console.log("No se ha seleccionado ninguna foto.");
            Swal.fire({
                title: 'Fail!',
                html: 'No se ha seleccionado ninguna foto.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
            return
        }
        try {

            const formData = new FormData();
            formData.append('imagen', fotoSeleccionada);
            console.log("fotoSeleccionada", fotoSeleccionada)
            const response = await fetch('http://' + dip + '/extraertexto', {
                method: 'POST',
                body: formData,
            });


            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();

            setDextoDetectado(result.texto)
            //   respuesta = result.mensaje
            console.log(result.texto, "respuesta")
            //   Swal.fire({
            //     title: 'Success!',
            //     html: 'Foto subida correctamente',
            //     icon: 'success',
            //     confirmButtonText: 'Aceptar'
            //   })
            //Manejar logica del resultado de la api

        } catch (error) {
            console.error('Error al enviar el nombre:', error);
        }

    };



    return (
        <>
            <Navegador />

            <h1>Subir Foto</h1>
            <div className="subirFotos">
                <div className="izquierda">
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    <br></br>
                    <button onClick={cargarFoto}>Cargar foto</button>
                    <button onClick={handleSubmit}>Enviar</button>
                </div>
                <div className="derecha">
                    <p><strong>Imagen</strong></p>
                    <img id="imagenMostrada" style={{ display: 'none', maxWidth: '100%' }} alt="Foto" />
                    <br></br>
                    <br></br>
                    <br></br>
                    <p><strong>Texto detectado</strong></p>
                    {textoDetectado.split("\n").map((linea, index) => (
                        <p key={index}>{linea}</p>
                    ))}
                </div>
            </div>
            <p>{respuesta}</p>
        </>
    );
}

export default SubirFotos;