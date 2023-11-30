import { getToken } from "./getToken"

export const checkIfUserIsLogged = () => {
  const token = getToken();

  return !!token
}