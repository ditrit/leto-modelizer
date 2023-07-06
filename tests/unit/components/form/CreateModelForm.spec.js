import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import CreateModelForm from 'src/components/form/CreateModelForm';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/Project', () => ({
  createProjectFolder: jest.fn(() => Promise.resolve()),
  writeProjectFile: jest.fn((id) => {
    if (id === 'error') {
      return Promise.reject();
    }
    if (id === 'eexist') {
      return Promise.reject({ name: 'EEXIST' });
    }
    return Promise.resolve();
  }),
  getAllModels: jest.fn(() => Promise.resolve([])),
  getProjectFolders: jest.fn(() => Promise.resolve([])),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(() => [{
    data: { name: 'pluginName' },
    configuration: { defaultFileName: 'test' },
  }]),
  getPluginByName: jest.fn(() => ({
    data: { name: 'pluginName' },
    configuration: { defaultFileName: 'test' },
  })),
}));

describe('Test component: CreateModelForm', () => {
  let wrapper;
  let useRouterPush;

  beforeEach(() => {
    useRouterPush = jest.fn();

    useRouter.mockImplementation(() => ({
      push: useRouterPush,
    }));

    wrapper = shallowMount(CreateModelForm, {
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

  describe('Test function: onSubmit', () => {
    it('should emit a positive notification on success and redirect', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
      expect(useRouterPush).toHaveBeenCalledTimes(1);
    });

    it('should emit a negative notification on EEXIST error', async () => {
      await wrapper.setProps({ projectName: 'eexist' });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
        message: 'actions.models.create.notify.eexist',
      }));
    });

    it('should emit a negative notification on error', async () => {
      await wrapper.setProps({ projectName: 'error' });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
        message: 'actions.models.create.notify.error',
      }));
    });
  });
});
