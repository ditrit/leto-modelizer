import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelsPage from 'src/pages/ModelsPage';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({
    params: {
      projectName: 'project-00000000',
    },
  })),
}));

jest.mock('src/composables/events/DialogEvent', () => ({
  next: jest.fn(),
}));

describe('Test page component: ModelsPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ModelsPage);
  });

  describe('Test computed: projectName', () => {
    it('should match "project-00000000"', () => {
      expect(wrapper.vm.projectName).toEqual('project-00000000');
    });
  });

  describe('Test function: openImportModelTemplateDialog', () => {
    it('should emit event', () => {
      DialogEvent.next.mockClear();
      wrapper.vm.openImportModelTemplateDialog('template');

      expect(DialogEvent.next).toBeCalledWith({
        type: 'open',
        key: 'ImportModelTemplate',
        template: 'template',
      });
    });
  });
});
