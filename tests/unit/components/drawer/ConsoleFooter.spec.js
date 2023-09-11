import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ConsoleFooter from 'src/components/drawer/ConsoleFooter.vue';

installQuasarPlugin();

describe('Test component: ConsoleFooter', () => {
  let wrapper;

  beforeEach(() => {
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
});
