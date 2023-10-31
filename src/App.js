import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from './paginas/Login';
import Presentacion from "./paginas/Presentacion";
import Layout from "./Layout"; // Asegúrate de que la ruta sea correcta


function App() {
  return (
    <div className="app">

      <BrowserRouter>
      <Layout/>
        <Routes>
           <Route path="/auth/login" element={<LoginForm />} />
           <Route path="/paginas/Presentacion" element={<Presentacion />} />
           <Route path="/" element={<Presentacion />} />
        </Routes>
      </BrowserRouter>

     </div>
    
  );

}

export default App;
