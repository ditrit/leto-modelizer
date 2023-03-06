import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import NewProjectForm from 'src/components/form/NewProjectForm.vue';

installQuasarPlugin();

jest.mock('src/composables/Project', () => ({
  getProjects: jest.fn(() => ['project']),
}));

describe('Test component: NewProjectForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(NewProjectForm, {});
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event', async () => {
      await wrapper.vm.onSubmit();

      expect(wrapper.emitted()['project:create']).toBeTruthy();
    });
  });
});
