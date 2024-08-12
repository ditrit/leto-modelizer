import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ConsoleFooter from 'src/components/drawer/ConsoleFooter.vue';
import LogEvent from 'src/composables/events/LogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/LogEvent', () => ({
  FileLogEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test component: ConsoleFooter', () => {
  let wrapper;
  let fileLogEventSubscription;
  let fileLogEventUnsubscribe;

  beforeEach(() => {
    fileLogEventSubscription = jest.fn();
    fileLogEventUnsubscribe = jest.fn();

    LogEvent.FileLogEvent.subscribe.mockImplementation(() => {
      fileLogEventSubscription();
      return { unsubscribe: fileLogEventUnsubscribe };
    });

    wrapper = shallowMount(ConsoleFooter, {
      props: {
        errors: [{
          message: 'test message',
          startLine: 1,
          endLine: 2,
          startColumn: 3,
          endColumn: 4,
          severity: 'warning',
        }],
      },
    });
  });

  describe('Test function: toggleTab', () => {
    it('should expand/reduce the tab by putting "open" to true/false', () => {
      wrapper.vm.toggleTab('errors');
      expect(wrapper.vm.tabs.find((t) => t.name === 'errors').open).toBeTruthy();

      // If toggleTab is triggered another time, the value should be false
      wrapper.vm.toggleTab('errors');
      expect(wrapper.vm.tabs.find((t) => t.name === 'errors').open).toBeFalsy();
      expect(wrapper.vm.selectedTab).toEqual(null);
    });
  });

  describe('Test function updateFileLogs', () => {
    it('should update logs on call', () => {
      expect(wrapper.vm.logs).toEqual([]);

      wrapper.vm.updateFileLogs(['test']);
      expect(wrapper.vm.logs).toEqual(['test']);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to FileLogEvent', () => {
      expect(fileLogEventSubscription).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to FileLogEvent', () => {
      expect(fileLogEventUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(fileLogEventUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
