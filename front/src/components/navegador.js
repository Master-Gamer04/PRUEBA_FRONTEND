import './navegador.css';
import './estilo.css';

export function Navegador() {
    return (
        <>
            <strong>
                <div className="navegador">
                    <a href="/Home">HOME</a>
                    <a href="/editarperfil">Editar Perfil</a>
                    <a href="/subirfoto">Subir Foto</a>
                    <a href="/editarAlbum">Editar Album</a>
                    <a href="/verfotos">Ver Fotos</a>
                    <a href="/extraertexto">Extraer Texto</a>
                    <a href="/">Cerrar Sesion</a>
                </div>
            </strong>

        </>

    )
}

export default Navegador;
