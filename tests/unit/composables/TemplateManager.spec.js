import * as TemplateManager from 'src/composables/TemplateManager';
import { ComponentDefinition } from 'leto-modelizer-plugin-core';
import { templateLibraryApiClient } from 'src/boot/axios';

jest.mock('src/boot/axios', () => ({
  templateLibraryApiClient: {
    get: jest.fn(() => Promise.resolve({ data: 'content' })),
  },
}));

describe('Test composable: TemplateManager', () => {
  describe('Test function: getTemplateFileByPath', () => {
    it('should return a request containing object with data', async () => {
      const result = await TemplateManager.getTemplateFileByPath('index.json');

      expect(result).toEqual({ data: 'content' });
    });
  });

  describe('Test function: getRemoteTemplates', () => {
    it('should return templates array on success', async () => {
      templateLibraryApiClient.get.mockReturnValueOnce(Promise.resolve({ data: { templates: ['templates'] } }));
      process.env.TEMPLATE_LIBRARY_BASE_URL = 'url';

      const result = await TemplateManager.getRemoteTemplates();

      expect(result).toEqual(['templates']);
    });

    it('should return empty array if TEMPLATE_LIBRARY_BASE_URL is not defined', async () => {
      process.env.TEMPLATE_LIBRARY_BASE_URL = '';

      const result = await TemplateManager.getRemoteTemplates();

      expect(result).toEqual([]);
    });
  });

  describe('Test function: getTemplatesByType', () => {
    beforeEach(() => {
      process.env.TEMPLATE_LIBRARY_BASE_URL = 'url';
      const templates = [
        {
          key: 'terraform_webapp',
          name: 'Web application',
          plugin: 'terrator-plugin',
          type: 'model',
          description: 'Schema of web application.',
          url: null,
          files: ['main.tf'],
        },
        {
          key: 'terraform_java_webapp',
          name: 'Java web application',
          plugin: 'jenkins-plugin',
          type: 'component',
          description: 'Schema of java web application.',
          url: null,
          files: ['jenkinsfile'],
        },
        {
          key: 'kubernetes_provider',
          name: 'Kubernetes',
          plugin: 'kubernetes-plugin',
          type: 'component',
          description: 'Initialized kubernetes.',
          url: null,
          files: ['provider.yaml'],
        },
        {
          key: 'terraform_test_application',
          name: 'Test application',
          plugin: 'terrator-plugin',
          type: 'component',
          description: 'Initialized test application.',
          url: null,
          files: ['app.tf'],
        },
      ];
      templateLibraryApiClient.get.mockReturnValueOnce(Promise.resolve({ data: { templates } }));
    });

    it('should return filtered component type templates', async () => {
      const componentTemplates = await TemplateManager.getTemplatesByType('component', 'terrator-plugin');

      const result = new ComponentDefinition({
        type: 'Test application',
        icon: '/template-library/templates/terraform_test_application/icon.svg',
      });

      result.isTemplate = true;
      result.plugin = 'terrator-plugin';
      result.files = ['app.tf'];
      result.key = 'terraform_test_application';
      result.url = null;
      result.description = 'Initialized test application.';

      expect(componentTemplates).toEqual([result]);
    });

    it('should return filtered model type templates', async () => {
      const componentTemplates = await TemplateManager.getTemplatesByType('model');

      const result = new ComponentDefinition({
        type: 'Web application',
        icon: '/template-library/templates/terraform_webapp/icon.svg',
      });

      result.isTemplate = true;
      result.plugin = 'terrator-plugin';
      result.files = ['main.tf'];
      result.key = 'terraform_webapp';
      result.url = null;
      result.description = 'Schema of web application.';

      expect(componentTemplates).toEqual([result]);
    });
  });
});
