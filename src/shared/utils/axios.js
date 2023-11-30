import axios from "axios";
import { getToken } from "../services/getToken";
import { API_URL } from "../constants/services";

const token = getToken();
const api = axios;

const powerHouseApi = axios.create({
  baseURL: API_URL
});


powerHouseApi.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export {
  api,
  powerHouseApi
};
