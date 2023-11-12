import httpClient from '../client/http.client';

const BASE_KEYWORD_SERVICE_URL = '/keyword/v1';

export const listKeywords = async (filter) => {
  const queryFilter = filter ? `?${filter}` : '';
  const response = await httpClient.get(`${BASE_KEYWORD_SERVICE_URL}${queryFilter}`);
  return response.data.data;
}


export const uploadKeywords = async ({ listKeywords }) => {
  const response = await httpClient.post(`${BASE_KEYWORD_SERVICE_URL}/upload`, { listKeywords });
  return response.data.data;
}