import * as api from 'src/composables/LetoModelizerApi';
import { useUserStore } from 'src/stores/UserStore';

/**
 * Set the current user's session token in the local storage.
 * @param {string} sessionToken - The session token to store.
 */
export function setUserSessionToken(sessionToken) {
  localStorage.setItem('sessionToken', sessionToken);
}

/**
 * Get the current user's session token from the local storage.
 * @returns {string|null} The user's session token from the local storage.
 */
export function getUserSessionToken() {
  return localStorage.getItem('sessionToken');
}

/**
 * Log in the user using its temporaryCode. Once the user is logged, it saves
 * the user information in the dedicated store.
 * @param {string} temporaryCode - The temporary code obtained from the github provider.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function login(temporaryCode) {
  return api.login(temporaryCode)
    .then((response) => {
      const userStore = useUserStore();

      setUserSessionToken(response.data.sessionToken);

      userStore.username = response.data.username;
      userStore.firstname = response.data.firstname;
    });
}

/**
 * Initialize (GET request) information about the current user and store it in the dedicated store.
 * @param {string} sessionToken - The current user's session token.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function initUserInformation(sessionToken) {
  return api.getUserInformation(sessionToken)
    .then((response) => {
      const userStore = useUserStore();

      userStore.username = response.data.username;
      userStore.firstname = response.data.firstname;
    });
}
