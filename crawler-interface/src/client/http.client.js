import axios from 'axios';

const API_PUBLIC_PATHS = ['/auth/v1/token/access', '/auth/v1/token/login', '/auth/v1/token/logout']

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_SERVICE}/api/`,
  timeout: 1000,
  headers: { 'x-access-token': localStorage.getItem('accessToken') }
});

instance.interceptors.request.use(async (config) => {
  // Do something before request is sent
  const accessTokenExpiryIn = localStorage.getItem('accessTokenExpiryIn');
  if (!API_PUBLIC_PATHS.includes(config.url) && (new Date().getTime() >= new Date(parseInt(accessTokenExpiryIn)).getTime())) {
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
  if (error.name === 'TokenExpiredError' && error.url.includes('/auth/v1/token/acess')) {
    // Toast error
    console.log('error----', error);
  }
  return Promise.reject({ error, isForceLogout: true });
});

export default instance;