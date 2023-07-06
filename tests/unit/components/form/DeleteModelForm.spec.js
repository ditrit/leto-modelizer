import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import DeleteModelForm from 'src/components/form/DeleteModelForm';
import { Notify } from 'quasar';
import { deleteProjectDir, deleteProjectFile } from 'src/composables/Project';

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
  deleteProjectFile: jest.fn((old) => {
    if (old.startsWith('error')) {
      return Promise.reject();
    }

    return Promise.resolve();
  }),
  isDirectory: jest.fn((path) => path.indexOf('folder') >= 0),
}));

describe('Test component: DeleteModelForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DeleteModelForm, {
      props: {
        projectName: 'projectName',
        model: {
          path: 'modelName',
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
      await wrapper.setProps({ projectName: 'error' });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
        message: 'actions.models.delete.notify.error',
      }));
    });

    it('should delete file if model is a file', async () => {
      deleteProjectFile.mockClear();
      deleteProjectDir.mockClear();
      await wrapper.setProps({ model: { path: 'file' } });

      await wrapper.vm.onSubmit();

      expect(deleteProjectDir).toHaveBeenCalledTimes(0);
      expect(deleteProjectFile).toHaveBeenCalledTimes(1);
    });

    it('should delete folder if model is a folder', async () => {
      deleteProjectFile.mockClear();
      deleteProjectDir.mockClear();
      await wrapper.setProps({ model: { path: 'folder' } });

      await wrapper.vm.onSubmit();

      expect(deleteProjectDir).toHaveBeenCalledTimes(1);
      expect(deleteProjectFile).toHaveBeenCalledTimes(0);
    });
  });
});
