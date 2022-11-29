import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import DeleteFileDialog from 'src/components/dialog/DeleteFileDialog';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

describe('Test component: DeleteFileDialog', () => {
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

    wrapper = shallowMount(DeleteFileDialog, {
      props: {
        projectName: 'projectName',
      },
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "projectName"', () => {
        expect(wrapper.vm.projectName).toEqual('projectName');
      });
    });
  });

  describe('Test function: setDeletedFile', () => {
    it('should set deletedFile on valid event key', () => {
      expect(wrapper.vm.deletedFile).toBeNull();

      wrapper.vm.setDeletedFile({ file: { id: 'test' }, key: 'DeleteFile' });
      expect(wrapper.vm.deletedFile).toEqual({ id: 'test' });
    });

    it('should not set deletedFile on invalid event key', () => {
      expect(wrapper.vm.deletedFile).toBeNull();

      wrapper.vm.setDeletedFile({ file: { id: 'test' }, key: 'NotDeleteFile' });
      expect(wrapper.vm.deletedFile).toBeNull();
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
