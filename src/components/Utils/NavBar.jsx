import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "../../styles/Menu.css"; 
import { checkIfUserIsLogged } from "../../shared/services/checkIfIsLogged";
import { getUserLogged } from "../../shared/services/getUserLogged";

const NavBar = () => {
  const [logged, setLogged] = useState(checkIfUserIsLogged());
  const user = getUserLogged();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLogged(false);
    navigate('/');
  }

  useEffect(() => {
    setLogged(checkIfUserIsLogged());
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link className="power_house_link" to='/'>
            POWER HOUSE
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <NavLink className="navbar_link" to="/" activeclassname="active-link">
            Inicio
          </NavLink>
        </li>
        {logged ? (
          <>
            <li>
              <NavLink className="navbar_link" to="/users" activeclassname="active-link">
                Usuarios
              </NavLink>
            </li>
            <li>
              <NavLink className="navbar_link" to="/routines" activeclassname="active-link">
                Rutinas
              </NavLink>
            </li>
            <li>
              <NavLink className="navbar_link" to="/exercises" activeclassname="active-link">
                Ejercicios
              </NavLink>
            </li>
            <li>
              <NavLink className="navbar_link" to="/machines" activeclassname="active-link">
                Máquinas
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink className="navbar_link" to="/contacto" activeclassname="active-link">
              Contacto
            </NavLink>
          </li>
        )}
      </ul>
      <ul>
        {logged ? (
          <li>
            <span>@{user.username} </span>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </li>
        ) : (
          <li>
            <NavLink to="/auth/login" className="login-button" activeclassname="active-link">
              Iniciar Sesión
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
