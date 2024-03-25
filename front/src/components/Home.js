
import Navegador from "./navegador"
import "./navegador.css"
import "./estilo.css"


export function Home() {

    const usuarioAlmacenado = JSON.parse(localStorage.getItem("Usuario"))

    return (
        <div>
            <Navegador />
            <div className="izquierda">
                <br></br>
                <br></br>
                <p><strong>Foto de perfil: </strong></p>
                <img alt="imagen-perfil" width={300} height={300} src={"https://practica1-g6-imagenes1.s3.us-east-2.amazonaws.com/"+usuarioAlmacenado.foto} />
                <br></br>
                <br></br>
                <p><strong>{usuarioAlmacenado.labels.split("\n").map((linea, index) => (
                        <p key={index}>{linea}</p>
                    ))}</strong></p>
                <br></br>
            </div>

            <div className="derecha">
                <br></br>
                <br></br>
                <div className="home">
                    <p><strong>Nombre de usuario: </strong></p>
                    <b>{usuarioAlmacenado.user}</b>
                    <br></br>
                    <br></br>
                    <p><strong>Nombre completo: </strong></p>
                    <b>{usuarioAlmacenado.nombre}</b>
                </div>
            </div>

        </div>

    )

}