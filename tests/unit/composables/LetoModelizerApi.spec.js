import axios from 'axios';
import {
  login,
  getUserInformation,
  getAuthenticationUrl,
} from 'src/composables/LetoModelizerApi';

jest.mock('axios');

describe('User Authentication', () => {
  describe('Test function: getAuthenticationUrl', () => {
    it('should return the authentication url', async () => {
      const resp = { url: 'http://test:9090' };
      axios.get.mockResolvedValueOnce(resp);

      const res = await getAuthenticationUrl();

      expect(res.url).toEqual('http://test:9090');
    });
  });

  describe('Test function: login', () => {
    it('should return the information about the authentication', async () => {
      const resultPostGithubAuth = {
        data: {
          result: {
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
            authDataResponse: {},
            objectId: 'Ylof2OIHfi',
            __type: 'Object',
            className: '_User',
          },
        },
      };
      const resultPostUser = {
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
      };
      axios.post.mockResolvedValueOnce(resultPostGithubAuth).mockResolvedValueOnce(resultPostUser);

      const res = await login('tempCode');
      expect(res.sessionToken).toEqual('r:dead779dcda4970cc7f96c09a328d771');
      expect(res.username).toEqual('MySuperUsername');
      expect(res.firstname).toEqual('Pradeep');
    });
  });

  describe('Test function: getUserInformation', () => {
    it('should return the current user information', async () => {
      const resultPostUser = {
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
      };
      axios.get.mockResolvedValueOnce(resultPostUser);

      const res = await getUserInformation();
      expect(res.sessionToken).toEqual('r:dead779dcda4970cc7f96c09a328d771');
      expect(res.username).toEqual('MySuperUsername');
      expect(res.firstname).toEqual('Pradeep');
    });
  });
});
