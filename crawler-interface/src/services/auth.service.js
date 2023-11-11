import httpClient from '../client/http.client';

export const login = async ({ email, password }) => {
  const response = await httpClient.post('/auth/v1/login', { email, password });
  const accessToken = response.data.data.accessToken;
  const accessTokenExpiryIn = response.data.data.accessTokenExpiryIn;
  const userId = response.data.data.userId;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('accessTokenExpiryIn', accessTokenExpiryIn);
  localStorage.setItem('userId', userId);
  return response.data.data;
}