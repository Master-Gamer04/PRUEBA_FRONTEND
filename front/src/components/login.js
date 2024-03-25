import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './estilo.css';
import md5 from "md5"
import DIP from './variables'
import Swal from 'sweetalert2';
import CustomWebcam from './CustomWebcam';

const dip = DIP.DIP; // process.env.REACT_APP_DIP; 
export function Login() {

  function encriptarContrasena(contrasena) {
    return md5(contrasena);
  }

  const navigate = useNavigate()

  const [User, setInputValue] = useState('');
  const [Password, setpassValue] = useState("");
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [fotoTomada, setFotoTomada] = useState(false)
  const [entradaCamara, setEntradaCamara] = useState(true)
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handlepassChange = (e) => {
    setpassValue(e.target.value)
  }

  const handleFoto = (foto, tomada) => {
    setFotoSeleccionada(foto);
    setFotoTomada(tomada);
  }

  const handleEntradaCamara = () => {
    setEntradaCamara(!entradaCamara)
  }

  const Loguearse = async (e) => {
    if (entradaCamara) {
      // Aquí puedes hacer algo con el valor del input
      console.log('Valor del input:', User);
      console.log("contraseña", Password)

      const Passwordmd5 = encriptarContrasena(Password)

      try {
        const response = await fetch('http://' + dip + '/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: User, password: Passwordmd5 }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor:', result.mensaje);

        if (result.mensaje === "Existe") {
          const user = result.usuario
          const nombre = result.nombre_completo
          const labels = result.labels
          const usuario = {
            user: user,
            nombre: nombre,
            foto: result.foto,
            password: Password,
            labels: labels
          };

          localStorage.setItem("Usuario", JSON.stringify(usuario))

          console.log("actualizar")
          navigate("/Home");
        } else {
          Swal.fire({
            title: 'Fail!',
            html: 'Usiaro o contraseña incorrectos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
          console.log("Error")
          //Error
          navigate("/")
        }

      } catch (error) {
        console.error('Error al enviar el nombre:', error);
      }
    }else{
      if(fotoTomada){
      try {
        const response = await fetch('http://' + dip + '/loginCamara', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mensaje: "Existe", foto: fotoSeleccionada}),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        if (result.mensaje === "Existe") {
          const user = result.usuario
          const nombre = result.nombre_completo
          const Contraseña = result.password
          const labels = result.labels
          const usuario = {
            user: user,
            nombre: nombre,
            foto: result.foto,
            password: Contraseña,
            labels: labels
          };
          console.log(usuario)
          localStorage.setItem("Usuario", JSON.stringify(usuario))

          console.log("actualizar")
          navigate("/Home");
        } else {
          Swal.fire({
            title: 'Fail!',
            html: 'Error al entrar.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
          console.log("Error")
          //Error
          navigate("/")
        }

      } catch (error) {
        console.error('Error al enviar el nombre:', error);
      }
      }else{
        Swal.fire({
          title: 'Fail!',
          html: 'Error al tomar la foto.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
        console.log("Error")
        //Error
        navigate("/")
      
      }
    }
  };


  if (entradaCamara) {
    return (
      <>
        <h1>Login</h1>
        <div className='contenedor'>
          <div className='elemento'>
            <p><strong>User name</strong></p>
            <input type="text" value={User} onChange={handleInputChange}></input>
            <br></br>
            <br></br>
            <p><strong>Password</strong></p>
            <input type="password" value={Password} onChange={handlepassChange}></input> <br></br>
            <button onClick={Loguearse}>Login</button>
            <br></br>
            <br></br><button onClick={handleEntradaCamara}>Entrar por camara</button>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Link to="/Registro" state={{ Mensaje: " " }} >Aun no tienes cuenta, registrate aqui</Link>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <h1>Login</h1>
        <div className='contenedor'>
          <div className='elemento'>
            <CustomWebcam onFoto={handleFoto} />
            <br></br>
            <br></br>
            <button onClick={Loguearse}>Login</button>
            <br></br>
            <br></br>
            <button onClick={handleEntradaCamara}>Entrar por contraseña</button>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Link to="/Registro" state={{ Mensaje: " " }} >Aun no tienes cuenta, registrate aqui</Link>
          </div>
        </div>
      </>
    )
  }
}


export default Login