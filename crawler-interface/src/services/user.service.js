import httpClient from '../client/http.client';

export const me = async () => {
  const response = await httpClient.get('/user/v1/me');
  return response.data.data;
}