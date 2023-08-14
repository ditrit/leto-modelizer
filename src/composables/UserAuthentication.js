import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

let userManager = null;

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

  const providerConfig = {
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    ...authentication.find(({ name }) => name === providerName).config,
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
export function login() {
  return userManager.signinRedirect();
}

/**
 * Complete the login process by handling the callback after the user
 * is redirected back from the authentication provider.
 * @returns {Promise<object>} Promise with the logged-in user on success otherwise an error.
 */
export function completeLogin() {
  return userManager.signinRedirectCallback();
}

/**
 * Complete the silent login process by handling the callback after the user
 * is refreshed in the background without any user interaction.
 * @returns {Promise<object>} Promise with the refreshed user information on success,
 * otherwise an error.
 */
export function completeSilentLogin() {
  return userManager.signinSilentCallback();
}

/**
 * Retrieve the current user if available or triggers a request
 * to fetch the user's information from the authentication provider.
 * @returns {Promise<object>} Promise with the current user on success otherwise an error.
 */
export function getUser() {
  return userManager.getUser();
}
