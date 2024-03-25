import './navegador.css';
import './PerfilRegistroyEditar.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navegador from './navegador';
import Swal from 'sweetalert2';
import DIP from './variables'

const dip = DIP.DIP; // process.env.REACT_APP_DIP; 
export function EditarPerfil() {

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

  const navegar = useNavigate()
  const usuarioAlmacenado = JSON.parse(localStorage.getItem("Usuario"))


  const [User, setInputValue] = useState("")
  const [Name, setNameValue] = useState("")
  const [Password, setPasswordValue] = useState("")
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);


  const handleFileChange = (event) => {
    const foto = event.target.files[0];
    setFotoSeleccionada(foto);
  };


  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }
  const handleNameChange = (e) => {
    setNameValue(e.target.value)
  }
  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value)
  }




  const editarPerfil = async (e) => {
    let userold = usuarioAlmacenado.user


    //Confirmar contraseña
    // Verificar si se seleccionó una foto
    if (fotoSeleccionada) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // Obtener la URL de la imagen
        const urlImagen = event.target.result;
        console.log("prueba")
        console.log(fotoSeleccionada.name)
        // Mostrar la imagen en un elemento de imagen o cualquier otro elemento de tu elección
        document.getElementById('imagenMostrada').src = urlImagen;
        // Mostrar la imagen
        document.getElementById('imagenMostrada').style.display = 'block';
      };
      // Leer el archivo como una URL de datos
      reader.readAsDataURL(fotoSeleccionada);

    } else {
      console.log("No se ha seleccionado ninguna foto.");
      return
    }
    console.log(Password," ",usuarioAlmacenado)
    if (usuarioAlmacenado.password === Password) {
      try {
        const response = await fetch('http://' + dip + '/editarPerfil', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ User: User, Nombre: Name, Foto: fotoSeleccionada.name, oldUser: userold }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor:', result.mensaje);

        const formData = new FormData();
        formData.append('imagen', fotoSeleccionada);
        fetch('http://' + dip + '/subir-foto-perfil', {
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



        if (result.mensaje === "Correcto") {
          Swal.fire({
            title: 'Success!',
            html: 'Usuario editado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })

          const user = result.user
          const nombre = result.nombre
          console.log(User)
          console.log(nombre)


          console.log("Registro")
          const usuario = {
            user: user,
            nombre: nombre,
            foto: result.foto,
            password: Password
          };



          localStorage.setItem("Usuario", JSON.stringify(usuario))

          navegar("/editarperfil", {
            state: {
              Mensaje: "Usuario actualizado",
            }
          });
        } else {
          Swal.fire({
            title: 'Error!',
            html: 'Usuario no editado correctamente',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
          console.log("Error")
          //Error
          navegar("/editarperfil", {
            state: {
              Mensaje: "Error",
            }
          })
        }




      } catch (error) {
        console.error('Error al enviar el nombre:', error);
      }


    } else {
      Swal.fire({
        title: 'Error!',
        html: 'Contraseña incorrecta',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
      navegar("/editarperfil")
    }



  }

  return (
    <>
      <Navegador />
      <h1>Editar Perfil</h1>
      <div className='editarPerfil'>

        <div className='izquierda2'>

          <img id="imagenMostrada" style={{ display: 'none', maxWidth: '150%' }} alt="Foto" />
          <p><strong> Foto</strong></p>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button onClick={cargarFoto}>Cargar foto</button>
          <br />


        </div>
        <div className='centro2'>
          <p className='pRE'><strong>User Name</strong></p>
          <input className='Entreda' type="text" value={User} onChange={handleInputChange}></input>

          <p className='pRE'><strong>Name</strong></p>
          <input className='Entreda' type="text" value={Name} onChange={handleNameChange}></input>

          <p className='pRE'><strong>Confirmar Password</strong></p>
          <input className='Entreda' type="password" value={Password} onChange={handlePasswordChange}></input>
          <br />
          <button onClick={editarPerfil}>Editar</button>
        </div>

      </div>
    </>
  )
}

export default EditarPerfil;