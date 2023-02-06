import axios from 'axios';

const templateLibraryApiClient = axios.create({
  baseURL: '/template-library/',
  timeout: 15000,
});

templateLibraryApiClient.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => Promise.reject(error),
);

export { axios, templateLibraryApiClient };
