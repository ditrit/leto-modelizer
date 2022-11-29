import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import CreateFileDialog from 'src/components/dialog/CreateFileDialog';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

describe('Test component: CreateFileDialog', () => {
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

    wrapper = shallowMount(CreateFileDialog, {
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

  describe('Test function: setFileNode', () => {
    it('should set newFile and onFolder on valid event key', () => {
      expect(wrapper.vm.newFile).toBeNull();
      expect(wrapper.vm.onFolder).toBeNull();

      wrapper.vm.setFileNode({ key: 'CreateFile', file: { id: 'test' }, isFolder: true });
      expect(wrapper.vm.newFile).toEqual({ id: 'test' });
      expect(wrapper.vm.onFolder).toEqual(true);
    });

    it('should not set newFile and onFolder on invalid event key', () => {
      wrapper.vm.setFileNode({ key: 'NotCreateFile', file: { id: 'test' }, isFolder: true });
      expect(wrapper.vm.newFile).toBeNull();
      expect(wrapper.vm.onFolder).toBeNull();
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
