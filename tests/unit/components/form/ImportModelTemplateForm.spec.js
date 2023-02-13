import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ImportModelTemplateForm from 'src/components/form/ImportModelTemplateForm.vue';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

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
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplateFileByPath: jest.fn(() => Promise.resolve()),
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

  describe('Test function: onSubmit', () => {
    it('should emit an event on success and a notification', async () => {
      process.env.MODELS_DEFAULT_FOLDER = 'model';
      wrapper.vm.modelName = 'modelName';

      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.submitting).toEqual(false);
      expect(push).toHaveBeenCalledWith(expect.objectContaining({ query: { path: 'plugin/modelName' } }));
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
      process.env.MODELS_DEFAULT_FOLDER = '';

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
