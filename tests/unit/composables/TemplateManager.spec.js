import * as TemplateManager from 'src/composables/TemplateManager';
import { ComponentDefinition } from 'leto-modelizer-plugin-core';
import { templateLibraryApiClient } from 'src/boot/axios';
import { generateTemplate } from 'src/composables/TemplateManager';

jest.mock('src/boot/axios', () => ({
  templateLibraryApiClient: {
    get: jest.fn(() => Promise.resolve({ data: 'content' })),
  },
}));

jest.mock('src/composables/Project', () => ({
  readProjectFile: jest.fn(() => Promise.resolve({ id: 'TEST' })),
  appendProjectFile: jest.fn(() => Promise.resolve()),
  readDir: jest.fn(() => Promise.resolve([])),
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
        {
          key: 'project_template',
          name: 'Project template',
          type: 'project',
          plugins: ['a', 'b'],
          description: 'Project template example.',
          url: null,
          schemas: ['plugin/infra1', 'plugin/infra2'],
          files: ['plugin/infra1/main.tf', 'plugin/infra1/provider.tf', 'plugin/infra2/main.tf'],
        },
      ];
      templateLibraryApiClient.get.mockReturnValueOnce(Promise.resolve({ data: { templates } }));
    });

    it('should return filtered component type templates', async () => {
      const componentTemplates = await TemplateManager.getTemplatesByType('component', 'terrator-plugin');

      let result = new ComponentDefinition({
        type: 'Test application',
        icon: '/template-library/templates/terraform_test_application/icon.svg',
      });

      result = {
        ...result,
        isTemplate: true,
        plugin: 'terrator-plugin',
        files: ['app.tf'],
        key: 'terraform_test_application',
        url: null,
        models: undefined,
        schemas: [],
        plugins: undefined,
        description: 'Initialized test application.',
      };

      expect(componentTemplates).toEqual([result]);
    });

    it('should return filtered model type templates', async () => {
      const componentTemplates = await TemplateManager.getTemplatesByType('model');

      let result = new ComponentDefinition({
        type: 'Web application',
        icon: '/template-library/templates/terraform_webapp/icon.svg',
      });

      result = {
        ...result,
        isTemplate: true,
        plugin: 'terrator-plugin',
        files: ['main.tf'],
        key: 'terraform_webapp',
        url: null,
        models: undefined,
        schemas: [],
        plugins: undefined,
        description: 'Schema of web application.',
      };

      expect(componentTemplates).toEqual([result]);
    });

    it('should return filtered project type templates', async () => {
      const componentTemplates = await TemplateManager.getTemplatesByType('project');

      let result = new ComponentDefinition({
        type: 'Project template',
        icon: '/template-library/templates/project_template/icon.svg',
      });

      result = {
        ...result,
        isTemplate: true,
        plugin: undefined,
        files: ['plugin/infra1/main.tf', 'plugin/infra1/provider.tf', 'plugin/infra2/main.tf'],
        key: 'project_template',
        url: null,
        plugins: ['a', 'b'],
        schemas: ['plugin/infra1', 'plugin/infra2'],
        description: 'Project template example.',
      };

      expect(componentTemplates).toEqual([result]);
    });
  });

  describe('Test function: generateTemplate', () => {
    it('should generate content with prefix', () => {
      expect(generateTemplate('{{generateId("test_")}}')).toEqual(expect.stringMatching(/^test_.{6}$/));
    });

    it('should generate content without prefix', () => {
      expect(generateTemplate('{{generateId()}}')).toEqual(expect.stringMatching(/^.{6}$/));
    });
  });

  describe(' Test Function: getTemplateFiles', () => {
    it('should return an array containing 1 item', async () => {
      const definition = {
        files: ['filename'],
      };
      const result = await TemplateManager.getTemplateFiles('path', definition);

      expect(result.length).toEqual(1);
    });
  });
});
