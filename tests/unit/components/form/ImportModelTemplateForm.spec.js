import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ImportModelTemplateForm from 'src/components/form/ImportModelTemplateForm.vue';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import * as Project from 'src/composables/Project';
import { FileInput } from 'leto-modelizer-plugin-core';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

jest.mock('src/composables/Project', () => ({
  appendProjectFile: jest.fn(() => Promise.resolve()),
  createProjectFolder: jest.fn((projectName) => {
    if (projectName === 'error') {
      return Promise.reject();
    }
    if (projectName === 'eexist') {
      return Promise.reject({ name: 'EEXIST' });
    }
    return Promise.resolve();
  }),
  getAllModels: jest.fn(() => Promise.resolve([])),
  readProjectFile: jest.fn(),
  writeProjectFile: jest.fn(),
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplateFileByPath: jest.fn(() => Promise.resolve()),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: jest.fn(() => ({
    configuration: {
      restrictiveFolder: null,
    },
    getModels: () => [],
  })),
  getModelPath: jest.fn((_, model) => model),
}));

describe('Test component: ImportModelTemplateForm', () => {
  let wrapper;
  const push = jest.fn();

  useRouter.mockImplementation(() => ({ push }));

  beforeEach(() => {
    wrapper = shallowMount(ImportModelTemplateForm, {
      props: {
        projectName: 'test',
        template: {
          plugin: 'plugin',
          files: ['file'],
          key: 'key',
        },
      },
    });
  });

  describe('Test function: manageConfigFile', () => {
    it('should create "leto-modelizer.config.json" file with one model', async () => {
      const writeProjectFileMock = jest.fn();
      const templateConfigContent = {
        'terrator-plugin': {
          aws_1: {
            x: 30,
            y: 30,
            width: 110,
            height: 80,
            needsResizing: false,
            needsPositioning: false,
            manuallyResized: false,
          },
          nginx: {
            x: 180,
            y: 30,
            width: 110,
            height: 80,
            needsResizing: false,
            needsPositioning: false,
            manuallyResized: false,
          },
        },
      };
      const config = {
        modelName: templateConfigContent,
      };

      Project.readProjectFile.mockImplementation(() => Promise.resolve({}));
      Project.writeProjectFile.mockImplementation(writeProjectFileMock);

      await wrapper.vm.manageConfigFile('modelName', JSON.stringify(templateConfigContent));

      expect(writeProjectFileMock).toHaveBeenCalledWith(
        wrapper.vm.props.projectName,
        new FileInput({
          path: 'leto-modelizer.config.json',
          content: JSON.stringify(config, null, 2),
        }),
      );
    });

    it('should add another model config to "leto-modelizer.config.json" file', async () => {
      const writeProjectFileMock = jest.fn();
      const templateConfigContent = {
        'terrator-plugin': {
          aws_1: {
            x: 30,
            y: 30,
            width: 110,
            height: 80,
            needsResizing: false,
            needsPositioning: false,
            manuallyResized: false,
          },
          nginx: {
            x: 180,
            y: 30,
            width: 110,
            height: 80,
            needsResizing: false,
            needsPositioning: false,
            manuallyResized: false,
          },
        },
      };
      const config = {
        firstModel: {},
        modelName: templateConfigContent,
      };

      Project.readProjectFile.mockImplementation(
        () => Promise.resolve({ content: JSON.stringify({ firstModel: {} }) }),
      );
      Project.writeProjectFile.mockImplementation(writeProjectFileMock);

      await wrapper.vm.manageConfigFile('modelName', JSON.stringify(templateConfigContent));

      expect(writeProjectFileMock).toHaveBeenCalledWith(
        wrapper.vm.props.projectName,
        new FileInput({
          path: 'leto-modelizer.config.json',
          content: JSON.stringify(config, null, 2),
        }),
      );
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event on success and a notification', async () => {
      wrapper.vm.modelName = 'modelName';

      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.submitting).toEqual(false);
      expect(push).toHaveBeenCalledWith(expect.objectContaining({ query: { path: 'modelNamefile', plugin: 'plugin' } }));
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a notification on error', async () => {
      await wrapper.setProps({
        projectName: 'error',
        template: {
          plugin: 'plugin',
          files: ['file'],
          key: 'key',
        },
      });

      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should emit a notification on "EEXIST" error', async () => {
      await wrapper.setProps({
        projectName: 'eexist',
        template: {
          plugin: 'plugin',
          files: ['file'],
          key: 'key',
        },
      });

      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
