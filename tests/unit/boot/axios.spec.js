import {
  prepareQueryParameters,
  makeFilterRequest,
} from 'src/boot/axios';

jest.mock('src/stores/CsrfTokenStore', () => ({
  useCsrfStore: jest.fn(() => ({
    headerName: '',
    token: '',
    expirationDate: 0,
  })),
}));

describe('Test component: axios', () => {
  describe('Test function: prepareQueryParameters', () => {
    it('Should return empty string', async () => {
      expect('').toEqual(prepareQueryParameters());
      expect('').toEqual(prepareQueryParameters({}));
      expect('').toEqual(prepareQueryParameters({ name: '' }));
    });

    it('Should return valid string', async () => {
      expect('?name=test').toEqual(prepareQueryParameters({ name: 'test' }));
      expect('?name1=test1&name2=test2').toEqual(prepareQueryParameters({ name1: 'test1', name2: 'test2' }));
    });
  });

  describe('Test function: makeFilterRequest', () => {
    it('should handle pagination and make recursive requests', async () => {
      const mockResponse1 = {
        totalPages: 2,
        pageable: {
          pageNumber: 2,
        },
      };

      const mockResponse2 = {
        totalPages: 2,
        pageable: {
          pageNumber: 1,
        },
      };

      const apiInstance = {
        get: jest.fn()
          .mockResolvedValueOnce(mockResponse1)
          .mockResolvedValueOnce(mockResponse2),
      };

      const url = '/url?page=8';
      const result = await makeFilterRequest(apiInstance, url);

      expect(apiInstance.get).toHaveBeenCalledTimes(2);
      expect(apiInstance.get).toHaveBeenNthCalledWith(1, url);
      expect(apiInstance.get).toHaveBeenNthCalledWith(2, expect.stringMatching(/page=1/));
      expect(result).toEqual(mockResponse2);
    });
  });
});
