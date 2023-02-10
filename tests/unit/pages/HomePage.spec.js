import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import HomePage from 'src/pages/HomePage.vue';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  next: jest.fn(),
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplatesByType: jest.fn(() => Promise.resolve([{ template: 'template' }])),
}));

describe('Test page component: HomePage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(HomePage);
  });

  describe('Test function: openNewProjectTemplateDialog', () => {
    it('should emit DialogEvent', () => {
      DialogEvent.next = jest.fn();

      expect(DialogEvent.next).not.toHaveBeenCalled();

      wrapper.vm.openNewProjectTemplateDialog({});

      expect(DialogEvent.next).toHaveBeenCalledWith({
        type: 'open',
        key: 'NewProjectTemplate',
        template: {},
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should assign templates with return value of getTemplatesByType', () => {
      expect(wrapper.vm.templates).toEqual([{ template: 'template' }]);
    });
  });
});
