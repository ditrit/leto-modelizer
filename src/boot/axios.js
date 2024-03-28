import axios from 'axios';
import { useCsrfStore } from 'src/stores/CsrfTokenStore';

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

api.interceptors.request.use(
  async (config) => {
    if (['post', 'put', 'delete'].includes(config.method)) {
      const {
        token,
        headerName,
      } = useCsrfStore();

      config.headers[headerName] = token;
    }

    return config;
  },
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

/**
 * Asynchronously prepares a request by ensuring the availability of a valid CSRF token.
 *
 * This function uses a CSRF token to check if token is valid.
 * If not, it fetches a new CSRF token from the server using the provided API.
 * The retrieved CSRF token is then stored in the CSRF token store for future use.
 * @returns {Promise<object>} The API instance with an updated CSRF token.
 */
async function prepareApiRequest() {
  const csrfStore = useCsrfStore();
  const currentTime = new Date().getTime();

  if (!csrfStore.expirationDate || csrfStore.expirationDate < currentTime) {
    const csrf = await api.get('/csrf');

    csrfStore.headerName = csrf.headerName;
    csrfStore.token = csrf.token;
    csrfStore.expirationDate = csrf.expirationDate;
  }

  return api;
}

export { api, prepareApiRequest, templateLibraryApiClient };
