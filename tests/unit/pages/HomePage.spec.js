import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import HomePage from 'src/pages/HomePage.vue';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  next: jest.fn(),
}));

describe('Test page component: HomePage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(HomePage);
  });

  describe('Test function: openCreateProjectTemplateDialog', () => {
    it('should emit DialogEvent', () => {
      DialogEvent.next = jest.fn();

      expect(DialogEvent.next).not.toHaveBeenCalled();

      wrapper.vm.openCreateProjectTemplateDialog({});

      expect(DialogEvent.next).toHaveBeenCalledWith({
        type: 'open',
        key: 'CreateProjectTemplate',
        template: {},
      });
    });
  });
});
