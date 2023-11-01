import React, { useState } from 'react';
import { ALLOW_NEW_USER_REGISTRATION } from '../consts';
import '../estilos/LoginForm.css';
import {LoginService} from '../services/loginService';
import { Link, useNavigate } from 'react-router-dom';
import { checkIfUserIsLogged } from '../services/checkIfIsLogged';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    setErrorMessage('');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginService = new LoginService()
    // Aquí puedes agregar la lógica de autenticación
    loginService.run({
      username,
      password
    }).then((_res) => {
      if (checkIfUserIsLogged()){
        setUser(localStorage.getItem('user'));
        navigate('/');
        window.location.reload(false);
      }
      
    }).catch((e) => setErrorMessage(e.response?.data));
  }

  return (
    <div className="container">
      <div className="login-box">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td className="tableLogin-label">
                  <label>Usuario:</label>
                </td>
                <td>
                  <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={handleInputChange}
                    />
                </td>
              </tr>
              <tr>
                <td className="tableLogin-label">
                  <label>Contraseña:</label>
                </td>
                <td>
                  <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleInputChange}
                    />
                </td>
              </tr>
            </tbody>
          </table>
          <div className='login-buttons-group'>
            <button type="submit" className="signin-button">Iniciar sesión</button>
            {ALLOW_NEW_USER_REGISTRATION && (
              <Link to="/users/create" className='create-button'>Registrar nuevo usuario</Link> 
            )}
          </div>
        </form>
        {errorMessage && (
          <p className="error-message">Error: {errorMessage.error}</p>
        )}
        {user && <p>Bienvenido, {user}.</p>}
      </div>
    </div>
    
  );
}

export default LoginForm;
