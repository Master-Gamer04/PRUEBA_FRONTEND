import './navegador.css';
import './estilo.css';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import md5 from "md5"
import DIP from './variables'
import Swal from 'sweetalert2';
import CustomWebcam from './CustomWebcam';
const dip = DIP.DIP; // process.env.REACT_APP_DIP; 

export function Registro() {

    function encriptarContrasena(contrasena) {
        return md5(contrasena);
    }

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
    const location = useLocation()

    const [Name, setInputValue] = useState("");
    const [User_name, setUserNameValue] = useState("")
    const [Password, setPasswordValue] = useState("")
    const [Password2, setPassword2Value] = useState("")
    const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
    const [fotoTomada, setFotoTomada] = useState(false)

    const handleFileChange = (event) => {
        const foto = event.target.files[0];
        setFotoSeleccionada(foto);
    };

    const handleInputValue = (e) => {
        setInputValue(e.target.value)
    }
    const handleUserValue = (e) => {
        setUserNameValue(e.target.value)
    }
    const handlePasswordValue = (e) => {
        setPasswordValue(e.target.value)
    }

    const handlePassword2Value = (e) => {
        setPassword2Value(e.target.value)
    }


    const hanldeFoto = (foto, tomada) => {
        console.log(foto)
        setFotoSeleccionada(foto);
        setFotoTomada(tomada);
    }

    const registrarPerfil = async (e) => {
        if (fotoSeleccionada) {
            // const reader = new FileReader();
            // reader.onload = function (event) {
            //     // Obtener la URL de la imagen
            //     const urlImagen = event.target.result;
            //     console.log("prueba")
            //     console.log(fotoSeleccionada, "aaa")
            //     // Mostrar la imagen en un elemento de imagen o cualquier otro elemento de tu elección
            //     document.getElementById('imagenMostrada').src = urlImagen;
            //     // Mostrar la imagen
            //     document.getElementById('imagenMostrada').style.display = 'block';
            // };
            // // Leer el archivo como una URL de datos
            // reader.readAsDataURL(fotoSeleccionada);

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

        //Verificar que las contraseñas coincidad

        if (Password === Password2) {
            try {

                const passwordmd5 = encriptarContrasena(Password)
                const response = await fetch('http://' + dip + '/registro', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Name: Name, User: User_name, Password: passwordmd5, Foto: fotoSeleccionada })
                });
                const formData = new FormData();
                console.log(fotoTomada, "fotoTomada")
                if (fotoTomada) {
                    const img = new Image();
                    img.src = fotoSeleccionada;


                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const pngBase64String = canvas.toDataURL('image/png');
                    console.log(pngBase64String)
                    var arr = pngBase64String.split(',')

                    var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);


                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    
                    formData.append('imagen', new File([u8arr], 'fotoPerfil', { type: 'png' }));
                } else {
                    formData.append('imagen', fotoSeleccionada);
                }


                // console.log(fotoSeleccionada)

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



                const result = await response.json();

                if (result.Mensaje === "Correcto") {
                    // setInputValue[""]
                    // setUserNameValue[""]
                    // setPasswordValue[""]
                    // setPassword2Value[""]
                    // setFotoSeleccionada(null)
                    Swal.fire({
                        title: 'Success!',
                        html: 'Usuario registrado correctamente',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    })
                    navegar("/Registro", {
                        state: {
                            Mensaje: "Usuario registrado correctamente",
                        }
                    });

                } else if (result.Mensaje === "Existe") {
                    Swal.fire({
                        title: 'Fail!',
                        html: 'User Existe',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                    navegar("/Registro", {
                        state: {
                            Mensaje: "Error",
                        }
                    });

                } else {
                    Swal.fire({
                        title: 'Fail!',
                        html: 'User no registrado',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                    navegar("/Registro", {
                        state: {
                            Mensaje: "Error",
                        }
                    });
                }

            } catch (error) {
                console.error("Error al enviar datos:", error)
            }

        } else {
            navegar("/Registro", {
                state: {
                    Mensaje: "No coinciden las contraseñas",
                }
            });

        }



    }

    return (
        <>
            <h1>Registro</h1>
            <div className='izquierda'>
                <div>
                    <CustomWebcam onFoto={hanldeFoto} />
                    <p><strong> Foto</strong></p>
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    <br></br>
                    <button onClick={cargarFoto}>Cargar foto</button>
                    <br></br>
                    <br></br>
                    <img id="imagenMostrada" style={{ display: 'none', maxWidth: '100%' }} alt="Foto" />
                </div>
            </div>
            <p>{location.state.Mensaje}</p>
            <div className='derecha'>
                <p><strong>Name</strong></p>
                <input id="Name" name="Name" value={Name} onChange={handleInputValue}></input>
                <br></br>
                <br></br>
                <p><strong>User Name</strong></p>
                <input id="User_Name" name="User_Name" value={User_name} onChange={handleUserValue}></input>
                <br></br>
                <br></br>
                <p><strong>Password</strong></p>
                <input id="Password" name="Password" type="password" value={Password} onChange={handlePasswordValue}></input>
                <br></br>
                <br></br>
                <p><strong>Confirmar Password</strong></p>
                <input id="Confirmar_Password" name="Confirmar_Password" type="password" value={Password2} onChange={handlePassword2Value}></input>
                <br></br>
                <br></br>
                <button onClick={registrarPerfil}>Registrarse</button>
                <br />
                <Link to="/">Ya tienes cuenta</Link>
            </div>
        </>
    )
}

export default Registro;