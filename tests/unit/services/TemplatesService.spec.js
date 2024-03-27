import { api } from 'src/boot/axios';
import * as TemplatesService from 'src/services/TemplatesService';
import { getTemplatesByType } from 'src/composables/TemplateManager';

jest.mock('src/boot/axios', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplatesByType: jest.fn(),
}));

describe('Templates Service', () => {
  describe('Test function: getApiTemplatesByType', () => {
    it('should return a template list', async () => {
      const resultGetTemplates = { content: [{ name: 'Project Template', type: 'PROJECT' }] };
      api.get.mockImplementation(() => Promise.resolve(resultGetTemplates));

      const res = await TemplatesService.getAPITemplatesByType('project');

      expect(res.length).toEqual(1);
      expect(res[0].name).toEqual('Project Template');
      expect(res[0].type).toEqual('PROJECT');
    });
  });

  describe('Test function: getProjectTemplates', () => {
    it('should return a template list without calling api', async () => {
      delete process.env.HAS_BACKEND;
      const resultGetTemplates = ['test'];
      getTemplatesByType.mockImplementation(() => Promise.resolve(resultGetTemplates));

      const res = await TemplatesService.getProjectTemplates();

      expect(res).toEqual(resultGetTemplates);
    });

    it('should return a template list calling api', async () => {
      process.env.HAS_BACKEND = true;
      const resultGetTemplates = { content: [{ name: 'Project Template', type: 'PROJECT' }] };
      api.get.mockImplementation(() => Promise.resolve(resultGetTemplates));

      const res = await TemplatesService.getProjectTemplates();

      expect(res.length).toEqual(1);
      expect(res[0].name).toEqual('Project Template');
      expect(res[0].type).toEqual('PROJECT');
      delete process.env.HAS_BACKEND;
    });
  });
});
