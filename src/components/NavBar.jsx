import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkIfUserIsLogged } from '../services/checkIfIsLogged'
import "../estilos/Menu.css"; // Importa los estilos del menú

const NavBar = () => {

  const [logged, setLogged] = useState(checkIfUserIsLogged());

  const navigate = useNavigate();

  // Verifica si el usuario ha iniciado sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLogged(false);
    navigate('/');
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        {logged ? (
          <>
            <li>
              <Link to="/users">Usuarios</Link>
            </li>
            <li>
              <Link to="/routines">Rutinas</Link>
            </li>
            <li>
              <Link to="/inventory">Máquinas</Link>
            </li>
          </>
        )
        : 
        (
          <li>
          <Link to="/contacto">Contacto</Link>
        </li>
        )}
        
      </ul>
      <ul>
        {logged ?  (
        <li>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </li>
       ) : (
        <li>
          <Link to="/auth/login" className="login-button">Iniciar Sesión</Link>
        </li>
        
      )}
       </ul>
    </nav>
  );
};

export default NavBar;
