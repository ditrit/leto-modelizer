import { api, prepareApiRequest } from 'src/boot/axios';
import * as AIService from 'src/services/AIService';

jest.mock('src/boot/axios', () => ({
  prepareApiRequest: jest.fn(),
  api: {
    post: jest.fn(),
  },
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
});
