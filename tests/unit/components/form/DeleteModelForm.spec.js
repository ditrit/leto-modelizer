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
  deleteProjectDir: jest.fn((old) => {
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
          name: 'modelName',
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
        name: 'modelName',
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit a positive notification on success', async () => {
      process.env.MODELS_DEFAULT_FOLDER = '';
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
      expect(Notify.create).toHaveBeenCalledTimes(1);

      process.env.MODELS_DEFAULT_FOLDER = 'test';

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'positive' }));
      expect(Notify.create).toHaveBeenCalledTimes(2);
    });

    it('should emit a negative notification on error', async () => {
      await wrapper.setProps({ projectName: 'error' });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
        message: 'actions.models.delete.notify.error',
      }));
    });
  });
});
