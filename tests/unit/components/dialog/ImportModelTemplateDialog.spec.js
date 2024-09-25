import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import ImportModelTemplateDialog from 'src/components/dialog/ImportModelTemplateDialog.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import { directive as viewer } from 'v-viewer';
import { getTemplateSchema } from 'src/services/ImageDownloadService';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  getProjectFiles: jest.fn(() => Promise.resolve(['projectFile'])),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: jest.fn(() => ({
    getModels: () => ['modelFile'],
  })),
}));

jest.mock('src/services/ImageDownloadService', () => ({
  getTemplateSchema: jest.fn((env, template, index) => Promise.resolve(`schema_${index}`)),
}));

describe('Test component: ImportModelTemplateDialog', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();

    DialogEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(ImportModelTemplateDialog, {
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
        directives: {
          viewer,
        },
      },
      props: {
        projectName: 'projectName',
      },
    });
  });

  describe('Test props: projectName', () => {
    it('should match "projectName"', () => {
      expect(wrapper.vm.projectName).toEqual('projectName');
    });
  });

  describe('Test function: loadTemplateSchema', () => {
    it('should load schema', async () => {
      wrapper.vm.schema = null;
      await wrapper.vm.loadTemplateSchema(null);
      expect(wrapper.vm.schema).toEqual('schema_0');
    });

    it('should set icon to null on error', async () => {
      wrapper.vm.schema = '0';
      getTemplateSchema.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadTemplateSchema(null);
      expect(wrapper.vm.schema).toEqual(null);
    });
  });

  describe('Test function: init', () => {
    it('should set project files and diagrams', async () => {
      wrapper.vm.allProjectFiles = null;
      wrapper.vm.allProjectDiagrams = null;
      wrapper.vm.modelTemplate = {
        plugins: ['test'],
      };

      await wrapper.vm.init();

      expect(wrapper.vm.allProjectFiles).toEqual(['projectFile']);
      expect(wrapper.vm.allProjectDiagrams).toEqual(['modelFile']);
    });
  });

  describe('Test function: setModelTemplate', () => {
    it('should set modelTemplate on valid event key', () => {
      expect(wrapper.vm.modelTemplate).toBeNull();

      wrapper.vm.setModelTemplate({
        key: 'ImportModelTemplate',
        template: {
          id: 'id_1',
          plugins: ['test'],
        },
      });
      expect(wrapper.vm.modelTemplate).toEqual({
        id: 'id_1',
        plugins: ['test'],
      });
    });

    it('should not set modelTemplate on invalid event key', () => {
      wrapper.vm.setModelTemplate({
        key: 'NotImportModelTemplate',
        template: {
          id: 'id_1',
          plugins: ['test'],
        },
      });
      expect(wrapper.vm.modelTemplate).toBeNull();
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe DialogEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe DialogEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
