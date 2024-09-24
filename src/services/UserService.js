import { api, makeFilterRequest, prepareQueryParameters } from 'boot/axios';
import { useUserStore } from 'src/stores/UserStore';

/**
 * Retrieve (GET request) information about the current user.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function getCurrent() {
  return api.get('/users/me').then(({ data }) => data);
}

/**
 * Retrieve (GET request) all permissions of a user.
 * @returns {Promise<object[]>} Return an array of permissions.
 */
export async function getUserPermissions() {
  return api.get('/users/me/permissions').then(({ data }) => data);
}

/**
 * Retrieve (GET request) all conversations of a user.
 * @param {object} filters - Query parameters filters.
 * @returns {Promise<object>} Return response data.
 */
export async function getUserAIConversations(filters) {
  const queryParameters = prepareQueryParameters(filters);

  return makeFilterRequest(api, `/users/me/ai/conversations${queryParameters}`).then(({ data }) => data);
}

/**
 * Initialize (GET request) information about the current user and store it in the dedicated store.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function initUserInformation() {
  return getCurrent()
    .then((data) => {
      const userStore = useUserStore();

      userStore.login = data.login;
      userStore.name = data.name;
      userStore.email = data.email;
    });
}

/**
 * Retrieve (GET request) all permissions of user and store them in the dedicated store.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function initUserPermissions() {
  return getUserPermissions().then((data) => {
    const userStore = useUserStore();

    userStore.permissions = data;
  });
}
