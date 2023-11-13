import {
  setUserSessionToken,
  getUserSessionToken,
  login,
  initUserInformation,
} from 'src/composables/UserAuthentication';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from 'src/stores/UserStore';

jest.mock('src/composables/LetoModelizerApi', () => ({
  login(tempCode) {
    if (tempCode === 'error') {
      return Promise.reject();
    }

    return Promise.resolve({
      data: {
        objectId: 'Ylof2OIHfi',
        createdAt: '2023-10-25T12:19:09.068Z',
        updatedAt: '2023-10-25T12:19:09.068Z',
        username: 'MySuperUsername',
        authData: {
          github: {
            id: 99999,
            access_token: 'gho_MySuperAccessToken',
          },
        },
        firstname: 'Pradeep',
        ACL: {
          Ylof2OIHfi: {
            read: true,
            write: true,
          },
        },
        sessionToken: 'r:dead779dcda4970cc7f96c09a328d771',
      },
    });
  },
  getUserInformation(sessionToken) {
    if (sessionToken === 'error') {
      return Promise.reject();
    }

    return Promise.resolve({
      data: {
        objectId: 'Ylof2OIHfi',
        createdAt: '2023-10-25T12:19:09.068Z',
        updatedAt: '2023-10-25T12:19:09.068Z',
        username: 'MySuperUsername',
        authData: {
          github: {
            id: 99999,
            access_token: 'gho_MySuperAccessToken',
          },
        },
        firstname: 'Pradeep',
        ACL: {
          Ylof2OIHfi: {
            read: true,
            write: true,
          },
        },
        sessionToken: 'r:dead779dcda4970cc7f96c09a328d771',
      },
    });
  },
}));

describe('User Authentication', () => {
  describe('Test function: setUserSessionToken', () => {
    it('should set the session token in the local storage', () => {
      const setItem = jest.spyOn(Storage.prototype, 'setItem');

      setUserSessionToken('MySessionToken');

      expect(setItem).toHaveBeenCalledWith('sessionToken', 'MySessionToken');
    });
  });

  describe('Test function: getUserSessionToken', () => {
    it('should get the session token from the local storage', () => {
      const getItem = jest.spyOn(Storage.prototype, 'getItem');

      getUserSessionToken();

      expect(getItem).toHaveBeenCalledWith('sessionToken');
    });
  });

  describe('Test function: login', () => {
    it('should login using the api and store the user info in pinia', async () => {
      setActivePinia(createPinia());
      const store = useUserStore();

      jest.spyOn(Storage.prototype, 'setItem');

      await login('tempCode');

      expect(store.firstname).toEqual('Pradeep');
    });
  });

  describe('Test function: initUserInformation', () => {
    it('should retrieve user info for storing its data', async () => {
      setActivePinia(createPinia());
      const store = useUserStore();

      jest.spyOn(Storage.prototype, 'setItem');

      await initUserInformation('tempCode');

      expect(store.firstname).toEqual('Pradeep');
    });
  });
});
