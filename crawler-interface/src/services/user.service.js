import httpClient from '../client/http.client';

const BASE_SERVICE_URL = '/user/v1';

export const me = async () => {
  const response = await httpClient.get(`${BASE_SERVICE_URL}/me`);
  return response.data.data;
}


export const register = async ({ email, password }) => {
  const response = await httpClient.post(`${BASE_SERVICE_URL}/register`, { email, password });
  return response.data.data;
}
