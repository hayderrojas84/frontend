import { powerHouseApi } from '../utils/axios';


export class LoginService {
  async run({ username, password }) {
    const credentials = {
      username,
      password
    }  
    const res = await powerHouseApi.post('/auth/login', credentials);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
}