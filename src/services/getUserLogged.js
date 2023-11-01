import { checkIfUserIsLogged } from "./checkIfIsLogged"

export const getUserLogged = () => {
  const userIsLogged = checkIfUserIsLogged();

  if (!userIsLogged) return null;

  return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
}