import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import CreateProjectForm from 'src/components/form/CreateProjectForm.vue';

installQuasarPlugin();

jest.mock('src/composables/Project', () => ({
  getProjects: jest.fn(() => ['project']),
}));

describe('Test component: CreateProjectForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CreateProjectForm, {});
  });

  describe('Test function: onSubmit', () => {
    it('should emit an event', async () => {
      await wrapper.vm.onSubmit();

      expect(wrapper.emitted()['project:create']).toBeTruthy();
    });
  });
});
