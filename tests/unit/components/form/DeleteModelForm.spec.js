import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import DeleteModelForm from 'src/components/form/DeleteModelForm';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/Project', () => ({
  deleteDiagramFile: jest.fn((old) => {
    if (old.startsWith('error')) {
      return Promise.reject();
    }

    return Promise.resolve();
  }),
}));

describe('Test component: DeleteModelForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DeleteModelForm, {
      props: {
        projectName: 'projectName',
        model: {
          path: 'modelName',
          plugin: 'pluginName',
        },
      },
    });
  });

  describe('Test props: projectName', () => {
    it('should match "projectName"', () => {
      expect(wrapper.vm.projectName).toEqual('projectName');
    });
  });

  describe('Test props: model', () => {
    it('should be an Object with a name matching "modelName"', () => {
      expect(wrapper.vm.model).toEqual({
        path: 'modelName',
        plugin: 'pluginName',
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit a positive notification on success', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
      expect(Notify.create).toHaveBeenCalledTimes(1);
    });

    it('should emit a negative notification on error', async () => {
      Notify.create = jest.fn();

      await wrapper.setProps({ model: { plugin: 'error' } });
      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
        message: 'actions.models.delete.notify.error',
      }));
    });
  });
});
