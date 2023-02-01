import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import RenameModelForm from 'src/components/form/RenameModelForm';
import { Notify } from 'quasar';
import UpdateModelEvent from 'src/composables/events/ModelEvent';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/events/ModelEvent', () => ({ next: jest.fn() }));

jest.mock('src/composables/Project', () => ({
  rename: jest.fn((old) => {
    if (old.startsWith('error')) {
      return Promise.reject();
    }
    if (old.startsWith('eperm')) {
      return Promise.reject({ code: 'EPERM' });
    }
    return Promise.resolve();
  }),
}));

describe('Test component: RenameModelForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RenameModelForm, {
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
      expect(wrapper.vm.model).toEqual({ name: 'modelName' });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit a positive notification and UpdateModel event on success', async () => {
      Notify.create = jest.fn();
      process.env.MODELS_DEFAULT_FOLDER = '';

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledTimes(1);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
      expect(UpdateModelEvent.next).toHaveBeenCalledTimes(1);

      process.env.MODELS_DEFAULT_FOLDER = 'test';

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledTimes(2);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
      expect(UpdateModelEvent.next).toHaveBeenCalledTimes(2);
    });

    it('should emit a negative notification on EPERM error', async () => {
      await wrapper.setProps({ projectName: 'eperm' });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
        message: 'actions.models.rename.notify.eperm',
      }));
    });

    it('should emit a negative notification on error', async () => {
      await wrapper.setProps({ projectName: 'error' });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
        message: 'actions.models.rename.notify.error',
      }));
    });
  });
});
