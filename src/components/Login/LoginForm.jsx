import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/LoginForm.css';
import FormComponent from '../Forms/FormComponent';
import FormField from '../Forms/FormField';
import { ALLOW_NEW_USER_REGISTRATION } from '../../shared/constants/services';
import { LoginService } from '../../shared/services/loginService';
import { checkIfUserIsLogged } from '../../shared/services/checkIfIsLogged';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginService = new LoginService()
    loginService.run({
      username,
      password
    }).then((_res) => {
      if (checkIfUserIsLogged()) {
        navigate('/');
        window.location.reload(false);
      }
    }).catch((e) => {
      if (e.response?.data) setErrors(e.response.data)
    });
  }
  return (
    <div className='login_container'>
      <FormComponent operation="Iniciar Sesión" handleSubmit={handleSubmit}>
        <FormField errors={errors.username} label={'Nombre de usuario'} spanClass='span_in'>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
          />
        </FormField>
        <FormField errors={errors.password} label={'Contraseña'} spanClass='span_in'>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
        </FormField>
      </FormComponent>
      {(ALLOW_NEW_USER_REGISTRATION) && (
        <div className='text-center'>
          <Link className='create-button' to='/users/create'>Registrar nuevo usuario</Link>
        </div>
          
        )}
      {errors && (
        <p className="error-message">{errors.error}</p>
      )}
    </div>

  )
}

export default LoginForm;