import axios from 'axios';

const templateLibraryApiClient = axios.create({
  baseURL: '/template-library/',
  timeout: 15000,
});

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

templateLibraryApiClient.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  ({ data }) => Promise.resolve(data),
  (error) => {
    if (error.response.status === 401) {
      window.location.href = `${process.env.BACKEND_URL}/api/login`;
    }
    return Promise.reject(error);
  },
);

export { api, templateLibraryApiClient };
