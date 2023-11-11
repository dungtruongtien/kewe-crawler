import axios from 'axios';

const API_PUBLIC_PATHS = ['token/acess', 'login', 'logout']

console.log('process.env.REACT_APP_API_SERVICE----', process.env.REACT_APP_API_SERVICE);

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_SERVICE}/api/`,
  timeout: 1000,
  headers: { 'x-access-token': localStorage.getItem('accessToken') }
});

axios.interceptors.request.use(async (config) => {
  // Do something before request is sent
  const accessTokenExpiryIn = localStorage.getItem('accessTokenExpiryIn');
  if (!API_PUBLIC_PATHS.includes(config.url) && new Date().getTime() > new Date().getTime(accessTokenExpiryIn)) {
    const input = {
      refreshToken: localStorage.getItem('refreshToken'),
      userId: localStorage.getItem('userId')
    }
    const response = await instance.post('/auth/v1/token/access', input);
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return config;
}, function (error) {
  // Toast error and force logout
  console.log('error----', error);
});


axios.interceptors.response.use(async (response) => {
  return response;
}, function (error) {
  if(error.name === 'TokenExpiredError' && error.url.includes('/auth/v1/token/acess')) {
    // Toast error
    console.log('error----', error);
  }
  return Promise.reject({ error, isForceLogout: true });
});

export default instance;