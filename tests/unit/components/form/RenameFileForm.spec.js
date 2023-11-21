import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import RenameFileForm from 'src/components/form/RenameFileForm';
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
  readDir: jest.fn(() => ['test']),
  rename: jest.fn(
    (old, rename) => (rename === 'projectName/rename' ? Promise.resolve() : Promise.reject()),
  ),
}));

jest.mock('src/composables/Git', () => ({
  gitRemove: jest.fn(() => Promise.resolve()),
}));

describe('Test component: RenameFileForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RenameFileForm, {
      props: {
        projectName: 'projectName',
        file: {
          id: 'test',
          isfolder: false,
          label: 'test',
        },
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
        expect(wrapper.vm.file).toEqual({
          id: 'test',
          isfolder: false,
          label: 'test',
        });
      });
    });

    describe('Test variable: fileName', () => {
      it('should match the original file label', () => {
        expect(wrapper.vm.fileName).toEqual('test');
      });
    });

    describe('Test variable: submitting', () => {
      it('should be false', () => {
        expect(wrapper.vm.submitting).toEqual(false);
      });
    });

    describe('Test variable: labels', () => {
      it('should match []', () => {
        expect(wrapper.vm.labels).toEqual([]);
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event and a positive notification on success', async () => {
      wrapper.vm.fileName = 'rename';
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(wrapper.emitted()['file:rename']).toBeTruthy();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a negative notification on error', async () => {
      wrapper.vm.fileName = 'wrong';
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should emit nothing when rename with the same label', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).not.toHaveBeenCalled();
    });
  });

  describe('Test function: initLabels', () => {
    it('should set a new array to "labels" variable', async () => {
      wrapper.vm.labels = ['test'];

      await wrapper.vm.initLabels();

      expect(wrapper.vm.labels).toEqual([]);
    });
  });
});
