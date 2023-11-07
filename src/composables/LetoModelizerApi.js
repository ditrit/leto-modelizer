import axios from 'axios';

/**
 * Get the url to authenticate the user through its github provider.
 * @returns {Promise<object>} Promise with the url on success otherwise an error.
 */
export async function getAuthenticationUrl() {
  return axios.get('backend/authenticationUrl');
}

/**
 * Log the user through the Parse-Server backend using the temporary code
 * obtained from the github provider (from the url given by the backend).
 * @param {string} temporaryCode - The temporary code obtained from the github provider.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function login(temporaryCode) {
  const headers = {
    headers: {
      Accept: 'application/json',
      'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
    },
  };
  const params = {
    code: temporaryCode,
  };

  return axios.post('/backend/api/functions/GitHubAuth', params, headers)
    .then((response) => {
      const requestParams = {
        authData: response.data.result.authData,
        firstname: response.data.result.firstname,
        username: response.data.result.username,
      };

      // This call is to link the user to its provider (github).
      // In Parse-Server this call must be done using the previous received result.
      return axios.post('/backend/api/users/', requestParams, headers);
    });
}

/**
 * Retrieve (GET request) information about the current user.
 * @param {string} sessionToken - The current user's session token.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function getUserInformation(sessionToken) {
  const headers = {
    headers: {
      Accept: 'application/json',
      'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
      'X-Parse-Session-Token': sessionToken,
    },
  };

  return axios.get('/backend/api/users/me', headers);
}
