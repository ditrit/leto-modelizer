import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import DeleteFileForm from 'src/components/form/DeleteFileForm';
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
  deleteProjectFile: jest.fn((id) => {
    if (id === 'error') {
      return Promise.reject();
    }
    return Promise.resolve();
  }),
}));

describe('Test component: DeleteFileForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DeleteFileForm, {
      props: {
        projectName: 'projectName',
        file: {
          id: 'test',
          children: [1],
          isFolder: true,
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "projectName"', () => {
        expect(wrapper.vm.props.projectName).toEqual('projectName');
      });
    });

    describe('Test props: file', () => {
      it('should match file', () => {
        expect(wrapper.vm.props.file).toEqual({
          id: 'test',
          children: [1],
          isFolder: true,
        });
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event and a positive notification on success', async () => {
      Notify.create = jest.fn();
      wrapper.vm.confirmDelete = true;

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.confirmDelete).toEqual(true);
      expect(wrapper.emitted()['file:delete']).toBeTruthy();
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a negative notification on error', async () => {
      await wrapper.setProps({ projectName: 'error', file: { isFolder: false } });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should emit a negative notification on error without confirm deletion', async () => {
      await wrapper.setProps({
        projectName: 'error',
        file: {
          isFolder: true,
          children: [1],
        },
      });
      wrapper.vm.confirmDelete = false;
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
