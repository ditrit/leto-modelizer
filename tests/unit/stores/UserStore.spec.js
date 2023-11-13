import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from 'src/stores/UserStore';

describe('User Store', () => {
  let store = null;
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to: `useStore(pinia)`
    setActivePinia(createPinia());
    store = useUserStore();
  });

  describe('Test store variable: username', () => {
    it('should be initialized to an empty string', () => {
      expect(store.username).toBe('');
    });

    it('should return the new value after being set', () => {
      store.username = 'username';

      expect(store.username).toBe('username');
    });
  });

  describe('Test store variable: firstname', () => {
    it('should be initialized to an empty string', () => {
      expect(store.firstname).toBe('');
    });

    it('should return the new value after being set', () => {
      store.firstname = 'firstname';

      expect(store.firstname).toBe('firstname');
    });
  });

  describe('Test store actions: isEmpty', () => {
    it('should return true if username and firstname are empty', () => {
      expect(store.isEmpty).toBeTruthy();
    });

    it('should return false if username and firstname are not empty', () => {
      store.username = 'username';
      store.firstname = 'firstname';
      expect(store.isEmpty).toBeFalsy();
    });
  });
});
