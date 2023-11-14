import axios from 'axios';
import { subMinutes } from 'date-fns';

const API_PUBLIC_PATHS = ['/auth/v1/token/access', '/auth/v1/token/login', '/auth/v1/token/logout']

const instance = axios.create({
  baseURL: 'http://localhost:8081/api/',
  timeout: 5000,
});

instance.interceptors.request.use(async (config) => {
  config.headers['x-access-token'] = localStorage.getItem('accessToken');

  const accessTokenExpiryIn = localStorage.getItem('accessTokenExpiryIn');
  const now = new Date();
  const accessTokenExpiryInDate = new Date(parseInt(accessTokenExpiryIn));
  const accessTokenExpiryInSubOneMin = subMinutes(accessTokenExpiryInDate, 1);

  // Handle get new access token before expiration
  if (!API_PUBLIC_PATHS.includes(config.url) && (now.getTime() >= accessTokenExpiryInSubOneMin.getTime())) {
    const input = {
      refreshToken: localStorage.getItem('refreshToken'),
      userId: localStorage.getItem('userId')
    }
    const response = await instance.post('/auth/v1/token/access', input);
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('accessTokenExpiryIn', response.data.data.accessTokenExpiryIn);
    config.headers['x-access-token'] = response.data.data.accessToken;
  }
  return config;
}, function (error) {
  // Toast error and force logout
  console.log('error----', error);
});


instance.interceptors.response.use(async (response) => {
  return response;
}, function (error) {
  console.log('asdasd',error.config.url);
  if (error.config.url.includes('/auth/v1/token/access')) {
    // Toast error
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiryIn');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  }
  return Promise.reject(error);
});

export default instance;