import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import nunjucks from 'nunjucks';
import User from 'src/models/User';

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
 * Initiate the login process by redirecting the user to the authentication provider.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function login() {
  return userManager.signinRedirect();
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
