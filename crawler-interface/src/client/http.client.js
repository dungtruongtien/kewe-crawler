import axios from 'axios';
import { format, subMinutes, diff } from 'date-fns';

const API_PUBLIC_PATHS = ['/auth/v1/token/access', '/auth/v1/token/login', '/auth/v1/token/logout']

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_SERVICE}/api/`,
  timeout: 1000,
});

instance.interceptors.request.use(async (config) => {
  config.headers['x-access-token'] = localStorage.getItem('accessToken');
  // Do something before request is sent
  const accessTokenExpiryIn = localStorage.getItem('accessTokenExpiryIn');
  const now = new Date();
  const accessTokenExpiryInDate = new Date(parseInt(accessTokenExpiryIn));
  const accessTokenExpiryInSubOneMin = subMinutes(accessTokenExpiryInDate, 1);
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
  console.log('error----', error);
  if (error.name === 'TokenExpiredError' && error.url.includes('/auth/v1/token/acess')) {
    // Toast error
  }
  return Promise.reject({ error });
});

export default instance;