import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [user, setUser] = useState(null); // Agrega un estado para el usuario autenticado

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

    // Aquí puedes agregar la lógica de autenticación
    const credentials = {
      username,
      password
    };

    axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, credentials)
      .then((res) => {
        const token = res.data.token;

        localStorage.setItem('token', token);

        // Almacena el usuario autenticado en el estado
        setUser(credentials.username);

        // Redirige al usuario a "/presentacion"
        navigate('/');
      })
      .catch((error) => {
        setErrorMessage(error.response.data); // Muestra el mensaje de error
      });
  }

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
      {errorMessage && (
        <p className="error-message">Error: {errorMessage.error}</p>
      )}
      {user && <p>Bienvenido, {user}.</p>}
    </div>
  );
}

export default LoginForm;
