import { api } from 'boot/axios';
import { useUserStore } from 'src/stores/UserStore';

/**
 * Retrieve (GET request) information about the current user.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function getCurrent() {
  return api.get('/users/me');
}

/**
 * Retrieve (GET request) all permissions of a user.
 * @returns {Promise<object[]>} Return an array of permissions.
 */
export async function getUserPermissions() {
  return api.get('/users/me/permissions');
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
