import { API_URL } from '../consts';
import axios from '../utils/axios';

export class LoginService {
  run({ username, password }) {
    const credentials = {
      username,
      password
    }  
    return axios.post(`${API_URL}/auth/login`, credentials)
      .then((res) => {
        const {token, user} = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user))
      });
  }
}