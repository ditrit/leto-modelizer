import { api, makeFilterRequest, prepareApiRequest } from 'src/boot/axios';
import * as AIService from 'src/services/AIService';
import {
  deleteConversation,
  manageConversation,
  retrieveMessages,
  sendMessage,
} from 'src/services/AIService';

jest.mock('src/boot/axios', () => ({
  prepareQueryParameters: jest.fn(({ updateDate }) => `${updateDate}`),
  prepareApiRequest: jest.fn(),
  makeFilterRequest: jest.fn(),
  api: {
    delete: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('src/services/UserService', () => ({
  getUserAIConversations: jest.fn(({ key }) => Promise.resolve({
    content: key !== 'test/test/test' ? [] : [{
      id: 'id_1',
      checksum: '37268335dd6931045bdcdf92623ff819a64244b53d0e746d438797349d4da578',
    }],
  })),
}));

describe('AI Service tests', () => {
  describe('Test function: generateDiagram', () => {
    it('should return a diagram based on the description', async () => {
      const resultPostDiagram = '[{"name": "deployment.yaml", "content": "apiVersion: apps/v1\\nkind: Deployment"}]';
      api.post.mockImplementation(() => Promise.resolve(resultPostDiagram));
      prepareApiRequest.mockImplementation(() => Promise.resolve(api));

      const res = await AIService.generateDiagram('@ditrit/kubernator-plugin', 'give me a sample of code');

      expect(res).toEqual(resultPostDiagram);
    });
  });

  describe('Test function: manageConversation', () => {
    it('should create new conversation', async () => {
      api.post.mockClear();
      api.post.mockImplementation(() => Promise.resolve('ok'));
      prepareApiRequest.mockImplementation(() => Promise.resolve(api));
      const result = await manageConversation('', '', '', [{ path: 'test', content: 'test' }]);

      expect(api.post).toBeCalled();
      expect(result).toEqual('ok');
    });

    it('should update conversation on different checksum', async () => {
      api.put.mockClear();
      api.put.mockImplementation(() => Promise.resolve('ok'));
      prepareApiRequest.mockImplementation(() => Promise.resolve(api));
      const result = await manageConversation('test', 'test', 'test', [{ path: 'test', content: 'test2' }]);

      expect(api.put).toBeCalled();
      expect(result).toEqual('ok');
    });

    it('should not update conversation on same checksum', async () => {
      api.post.mockClear();
      api.put.mockClear();
      api.post.mockImplementation(() => Promise.resolve('ok'));
      api.put.mockImplementation(() => Promise.resolve('ok'));
      prepareApiRequest.mockImplementation(() => Promise.resolve(api));
      const result = await manageConversation('test', 'test', 'test', [{ path: 'test', content: 'test' }]);

      expect(api.post).not.toBeCalled();
      expect(api.put).not.toBeCalled();
      expect(result).toEqual({
        id: 'id_1',
        checksum: '37268335dd6931045bdcdf92623ff819a64244b53d0e746d438797349d4da578',
      });
    });
  });

  describe('Test function: sendMessage', () => {
    it('should send and return a message', async () => {
      api.post.mockClear();
      api.post.mockImplementation(() => Promise.resolve({
        message: 'H4sIAAAAAAAA//P3BgAt2TbXAgAAAA==',
      }));
      prepareApiRequest.mockImplementation(() => Promise.resolve(api));

      const result = await sendMessage('1', 'plugin', 'test');

      expect(result.message).toEqual('OK');
    });
  });

  describe('Test function: retrieveMessages', () => {
    it('should return an empty array without conversation', async () => {
      const result = await retrieveMessages('', '', '');

      expect(result).toEqual({ content: [], totalPages: 0 });
    });

    it('should return messages of conversation', async () => {
      prepareApiRequest.mockImplementation(() => Promise.resolve(api));
      makeFilterRequest.mockImplementation(() => Promise.resolve({
        content: [{
          message: 'H4sIAAAAAAAA//P3BgAt2TbXAgAAAA==',
        }],
      }));
      const result = await retrieveMessages('test', 'test', 'test');

      expect(result).toEqual({ content: [{ message: 'OK' }] });
    });
  });

  describe('Test function: deleteConversation', () => {
    it('should return promise reject without conversation', async () => {
      prepareApiRequest.mockClear();
      let isError = false;
      try {
        await deleteConversation('', '', '');
      } catch (e) {
        isError = true;
      }

      expect(isError).toEqual(true);
      expect(prepareApiRequest).not.toBeCalled();
    });

    it('should return messages of conversation', async () => {
      prepareApiRequest.mockImplementation(() => Promise.resolve(api));
      api.delete.mockImplementation(() => Promise.resolve('OK'));
      const result = await deleteConversation('test', 'test', 'test');

      expect(result).toEqual('OK');
    });
  });
});
