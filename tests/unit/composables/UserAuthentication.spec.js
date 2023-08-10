import {
  userManagerExists,
  setUserManager,
  login,
  completeLogin,
  completeSilentLogin,
  getUser,
} from 'src/composables/UserAuthentication';

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
    it('should call signinRedirect on userManager', async () => {
      process.env.AUTHENTICATION = JSON.stringify(authentication);

      setUserManager('Provider 1');

      const result = await login();

      expect(result).toEqual('login successful');
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
