
// import './App.css';
import VerFotos from './components/verFotos'
import SubirFoto from './components/subirFotos'
import Registro from './components/registro'
import EditarPerfil from './components/editarPerfil'
import { EditarAlbum } from './components/editarAlbum'
import ExtraerTexto from './components/extraerTexto'
import { Login } from './components/login'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Home } from './components/Home'

function App() {

  return (
    <div className="App">
      
      
      <header className="App-header">

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} href="/"></Route>
            <Route path='/Home' element={<Home />} href="/Home"/>
            <Route path='/editarperfil' element={<EditarPerfil />} /> 
            <Route path='/subirfoto' element={<SubirFoto />} />
            {/* <Route path='/editaralbum' element={<EditarAlbum />} /> */}
            <Route path="/editarAlbum" element={<EditarAlbum />}></Route>
            <Route path='/verfotos' element={<VerFotos />} />
            <Route path='/registro' element={<Registro />} />
            <Route path='/extraertexto' element={<ExtraerTexto />} />
          </Routes>
        </BrowserRouter>
      </header>
      
    </div>
  );
}

export default App;
