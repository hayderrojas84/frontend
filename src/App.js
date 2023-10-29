import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from './paginas/Login';
import Presentacion from "./paginas/Presentacion";



function App() {
  return (
    <div className="app">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Presentacion />} />
          <Route path="/auth/login" element={<LoginForm />} />
        </Routes>
      </BrowserRouter>

     </div>
    
  );

}

export default App;
