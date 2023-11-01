import axios from "axios";
import { getToken } from "../services/getToken";

// Interceptor para agregar el encabezado "Authorization" a las solicitudes si el token está presente
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
