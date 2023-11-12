import httpClient from '../client/http.client';

const BASE_SERVICE_URL = '/auth/v1';

export const login = async ({ email, password }) => {
  const response = await httpClient.post(`${BASE_SERVICE_URL}/login`, { email, password });
  const accessToken = response.data.data.accessToken;
  const refreshToken = response.data.data.refreshToken;
  const accessTokenExpiryIn = response.data.data.accessTokenExpiryIn;
  const userId = response.data.data.userId;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('accessTokenExpiryIn', accessTokenExpiryIn);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('userId', userId);
  return response.data.data;
}


export const logout = async (userId) => {
  return httpClient.post(`${BASE_SERVICE_URL}/logout`, { userId });
}