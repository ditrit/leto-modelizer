import {
  setUserSessionToken,
  getUserSessionToken,
  userManagerExists,
  setUserManager,
  login,
  initUserInformation,
  completeLogin,
  completeSilentLogin,
  getUser,
} from 'src/composables/UserAuthentication';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from 'src/stores/UserStore';

const mockConstructor = jest.fn();
const authentication = [
  {
    name: 'Provider 1',
    config: { a: 'a' },
    userMapping: {
      firstname: 'profile.firstname',
    },
  },
  {
    name: 'Provider 2',
    config: { b: 'b' },
  },
];

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

jest.mock('oidc-client-ts', () => ({
  UserManager: class {
    constructor(providerConfig) {
      mockConstructor();
      this.providerConfig = providerConfig;
    }

    // eslint-disable-next-line class-methods-use-this
    signinRedirect() {
      return Promise.resolve('login successful');
    }

    // eslint-disable-next-line class-methods-use-this
    signinRedirectCallback() {
      return Promise.resolve('completeLogin successful');
    }

    // eslint-disable-next-line class-methods-use-this
    signinSilentCallback() {
      return Promise.resolve('completeSilentLogin successful');
    }

    // eslint-disable-next-line class-methods-use-this
    getUser() {
      // return Promise.resolve('getUser successful');
      return Promise.resolve(
        this.providerConfig.a ? { profile: { firstname: 'firstname' } } : null,
      );
    }

    // eslint-disable-next-line class-methods-use-this
    events = {
      addAccessTokenExpired() {
        return Promise.resolve('addAccessTokenExpired');
      },
    };

    // eslint-disable-next-line class-methods-use-this
    signinSilent() {
      return Promise.resolve('signinSilent successful');
    }
  },
  WebStorageStateStore: class {},
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

  describe('Test function: setUserManager', () => {
    it('should not create userManager if authentication config is not provided', () => {
      process.env.AUTHENTICATION = JSON.stringify(null);

      setUserManager('Provider 1');

      expect(mockConstructor).toHaveBeenCalledTimes(0);
    });

    it('should not create userManager if provider name is not provided', () => {
      process.env.AUTHENTICATION = JSON.stringify(authentication);

      setUserManager(null);

      expect(mockConstructor).toHaveBeenCalledTimes(0);
    });

    it('should create userManager with correct provider config', () => {
      process.env.AUTHENTICATION = JSON.stringify(authentication);

      expect(mockConstructor).toHaveBeenCalledTimes(0);

      setUserManager('Provider 1');

      expect(mockConstructor).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: userManagerExists', () => {
    it('should return false if userManager is not initialized', () => {
      process.env.AUTHENTICATION = JSON.stringify(null);

      setUserManager(null);

      expect(userManagerExists()).toBe(false);
    });

    it('should return true if userManager is initialized', () => {
      process.env.AUTHENTICATION = JSON.stringify(authentication);

      setUserManager('Provider 1');

      expect(userManagerExists()).toBe(true);
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

  describe('Test function: completeLogin', () => {
    it('should complete the login process and return the logged-in user', async () => {
      process.env.AUTHENTICATION = JSON.stringify(authentication);

      setUserManager('Provider 1');

      const result = await completeLogin();

      expect(result).toEqual('completeLogin successful');
    });
  });

  describe('Test function: completeSilentLogin', () => {
    it('should complete the silent login process and return the refreshed user', async () => {
      process.env.AUTHENTICATION = JSON.stringify(authentication);

      setUserManager('Provider 1');

      const result = await completeSilentLogin();

      expect(result).toEqual('completeSilentLogin successful');
    });
  });

  describe('Test function: getUser', () => {
    it('should retrieve the current user from the user manager', async () => {
      process.env.AUTHENTICATION = JSON.stringify(authentication);

      setUserManager('Provider 1');

      const result = await getUser();

      expect(result).toEqual({
        email: null,
        firstname: 'firstname',
        id: null,
        lastname: null,
      });
    });

    it('should return null', async () => {
      process.env.AUTHENTICATION = JSON.stringify(authentication);

      setUserManager('Provider 2');

      const result = await getUser();

      expect(result).toBeNull();
    });
  });
});
