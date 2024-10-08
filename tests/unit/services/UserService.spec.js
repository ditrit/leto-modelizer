import { api, makeFilterRequest, prepareQueryParameters } from 'src/boot/axios';
import * as UserService from 'src/services/UserService';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from 'src/stores/UserStore';

jest.mock('src/boot/axios', () => ({
  api: {
    get: jest.fn(),
  },
  prepareQueryParameters: jest.fn(() => '?test=test'),
  makeFilterRequest: jest.fn(() => Promise.resolve()),
}));

describe('User Authentication', () => {
  describe('Test function: getCurrent', () => {
    it('should return the current user information', async () => {
      const resultGetUser = { data: { email: null, login: 'PowerRangerGreen', name: 'Seb' } };
      api.get.mockImplementation(() => Promise.resolve(resultGetUser));

      const res = await UserService.getCurrent();

      expect(res.email).toEqual(null);
      expect(res.login).toEqual('PowerRangerGreen');
      expect(res.name).toEqual('Seb');
    });
  });

  describe('Test function: getUserPermissions', () => {
    it('should return the current user permissions', async () => {
      const resultGetUserPerm = {
        data: [
          {
            entity: 'COMPONENT_TEMPLATE',
            action: 'CREATE',
          },
          {
            entity: 'PROJECT_TEMPLATE',
            action: 'CREATE',
          },
        ],
      };
      api.get.mockImplementation(() => Promise.resolve(resultGetUserPerm));

      const res = await UserService.getUserPermissions();

      expect(res[0]).toEqual({
        entity: 'COMPONENT_TEMPLATE',
        action: 'CREATE',
      });
    });
  });

  describe('Test function: initUserInformation', () => {
    it('should initialize user information in the user store', async () => {
      setActivePinia(createPinia());
      const store = useUserStore();

      const resultGetUser = { data: { login: 'PowerRangerGreen', name: 'Seb', email: 'seb@example.com' } };
      api.get.mockImplementation(() => Promise.resolve(resultGetUser));

      await UserService.initUserInformation();

      expect(store.login).toEqual('PowerRangerGreen');
      expect(store.name).toEqual('Seb');
      expect(store.email).toEqual('seb@example.com');
    });
  });

  describe('Test function: initUserPermissions', () => {
    it('should initialize user permissions in the user store', async () => {
      setActivePinia(createPinia());
      const store = useUserStore();

      const resultGetUserPerm = {
        data: [
          {
            entity: 'COMPONENT_TEMPLATE',
            action: 'CREATE',
          },
          {
            entity: 'PROJECT_TEMPLATE',
            action: 'CREATE',
          },
        ],
      };
      api.get.mockImplementation(() => Promise.resolve(resultGetUserPerm));

      await UserService.initUserPermissions();

      expect(store.permissions).toEqual([
        {
          entity: 'COMPONENT_TEMPLATE',
          action: 'CREATE',
        },
        {
          entity: 'PROJECT_TEMPLATE',
          action: 'CREATE',
        },
      ]);
    });
  });

  describe('Test function getUserAIConversations', () => {
    it('should call valid functions', async () => {
      prepareQueryParameters.mockClear();
      makeFilterRequest.mockClear();
      makeFilterRequest.mockImplementation(() => Promise.resolve({ data: null }));
      await UserService.getUserAIConversations({});

      expect(prepareQueryParameters).toBeCalled();
      expect(makeFilterRequest).toBeCalledWith(api, '/users/me/ai/conversations?test=test');
    });
  });
});
