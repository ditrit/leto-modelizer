import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import nunjucks from 'nunjucks';
import User from 'src/models/User';
import * as api from 'src/composables/LetoModelizerApi';
import { useUserStore } from 'src/stores/UserStore';

let userManager = null;
let userAuthentication = null;

/**
 * Checks if the user manager exists.
 * @returns {boolean} True if the user manager exists, otherwise false.
 */
export function userManagerExists() {
  return !!userManager;
}

/**
 * Initiate the login process by redirecting the user to the authentication provider.
 * @param {string} providerName - Name of the provider.
 */
export function setUserManager(providerName) {
  const authentication = process.env.AUTHENTICATION
    ? JSON.parse(process.env.AUTHENTICATION)
    : [];

  if (!authentication?.length || !providerName) {
    userManager = null;
    return;
  }

  userAuthentication = authentication.find(({ name }) => name === providerName);

  const providerConfig = {
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    ...userAuthentication.config,
  };

  userManager = new UserManager(providerConfig);

  userManager?.events.addAccessTokenExpired(() => {
    // Token has expired, handle token refresh process here

    userManager.signinSilent()
      .catch(() => {
        userManager.signinRedirect();
      });
  });
}

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

/**
 * Complete the login process by handling the callback after the user
 * is redirected back from the authentication provider.
 * @returns {Promise<object>} Promise with the logged-in user on success otherwise an error.
 */
export async function completeLogin() {
  return userManager.signinRedirectCallback();
}

/**
 * Complete the silent login process by handling the callback after the user
 * is refreshed in the background without any user interaction.
 * @returns {Promise<object>} Promise with the refreshed user information on success,
 * otherwise an error.
 */
export async function completeSilentLogin() {
  return userManager.signinSilentCallback();
}

/**
 * Retrieve the current user if available or triggers a request
 * to fetch the user's information from the authentication provider.
 * @returns {Promise<object>} Promise with the current user on success otherwise an error.
 */
export async function getUser() {
  return userManager?.getUser().then((user) => (user
    ? new User({
      firstname: nunjucks.renderString(`{{ ${userAuthentication?.userMapping?.firstname} }}`, user),
      lastname: nunjucks.renderString(`{{ ${userAuthentication?.userMapping?.lastname} }}`, user),
      email: nunjucks.renderString(`{{ ${userAuthentication?.userMapping?.email} }}`, user),
      id: nunjucks.renderString(`{{ ${userAuthentication?.userMapping?.id} }}`, user),
    })
    : null));
}
