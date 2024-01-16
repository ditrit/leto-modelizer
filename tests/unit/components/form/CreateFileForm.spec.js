import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import CreateFileForm from 'src/components/form/CreateFileForm';
import { Notify } from 'quasar';
import { createProjectFolder, writeProjectFile } from 'src/composables/Project';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/Project', () => ({
  createProjectFolder: jest.fn((id) => {
    if (id === 'error') {
      return Promise.reject();
    }
    return Promise.resolve();
  }),
  writeProjectFile: jest.fn(({ path }) => {
    if (path === 'error/') {
      return Promise.reject();
    }
    return Promise.resolve();
  }),
}));

describe('Test component: CreateFileForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CreateFileForm, {
      props: {
        projectName: 'projectName',
        file: { id: 'test' },
        isfolder: false,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "projectName"', () => {
        expect(wrapper.vm.projectName).toEqual('projectName');
      });
    });

    describe('Test props: file', () => {
      it('should match file', () => {
        expect(wrapper.vm.file).toEqual({ id: 'test' });
      });
    });

    describe('Test props: isFolder', () => {
      it('should be false', () => {
        expect(wrapper.vm.isFolder).toEqual(false);
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event and a positive notification on success', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(wrapper.emitted()['file:create']).toBeTruthy();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a negative notification on error', async () => {
      await wrapper.setProps({ file: { id: 'error' } });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should call writeProjectFile with file', async () => {
      await wrapper.setProps({ projectName: 'file', file: { id: 'file' } });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(writeProjectFile).toBeCalled();
    });

    it('should call createProjectFolder with folder', async () => {
      await wrapper.setProps({ isFolder: true });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(createProjectFolder).toBeCalled();
    });
  });
});
