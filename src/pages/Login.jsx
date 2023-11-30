import React, { useEffect } from 'react';
import LoginForm from '../components/Login/LoginForm';
import { useNavigate } from 'react-router-dom';
import { checkIfUserIsLogged } from '../shared/services/checkIfIsLogged';

function LoginPage() {
  document.title = 'Power House | Login';
  const navigate = useNavigate();
  useEffect(() => {
    const userIsLogged = checkIfUserIsLogged();
    if (userIsLogged) navigate('/');
  }, [navigate]);

  return (
    <LoginForm />
  );
}

export default LoginPage;
