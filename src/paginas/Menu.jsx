import React from "react";
import { Link } from "react-router-dom";
import "../estilos/Menu.css"; // Importa los estilos del menú

const Menu = () => {
  // Verifica si el usuario ha iniciado sesión
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/Presentacion">Rutinas</Link>
        </li>
        <li>
          <Link to="/contacto">Contacto</Link>
        </li>
      </ul>
      <ul>
        {isLoggedIn ? null : (
         <li>
           <Link to="/auth/login" className="login-button">Iniciar Sesión</Link>
         </li>
       )}
       </ul>
    </nav>
  );
};

export default Menu;
