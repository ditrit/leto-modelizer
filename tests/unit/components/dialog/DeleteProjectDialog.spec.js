import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import DeleteProjectDialog from 'src/components/dialog/DeleteProjectDialog';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

describe('Test component: DeleteProjectDialog', () => {
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

    wrapper = shallowMount(DeleteProjectDialog, {
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });
  });

  describe('Test function: setProjectId', () => {
    it('should set projectId on valid event key', () => {
      expect(wrapper.vm.projectId).toBeNull();

      wrapper.vm.setProjectId({ id: 'test', key: 'DeleteProject' });
      expect(wrapper.vm.projectId).toEqual('test');
    });

    it('should not set projectId on invalid event key', () => {
      expect(wrapper.vm.projectId).toBeNull();

      wrapper.vm.setProjectId({ id: 'test', key: 'NotDeleteProject' });
      expect(wrapper.vm.projectId).toBeNull();
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
