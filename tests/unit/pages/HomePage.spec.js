import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import HomePage from 'src/pages/HomePage.vue';

installQuasarPlugin();

jest.mock('src/composables/Project', () => ({
  createProjectTemplate: jest.fn(() => ({ id: 'project-00000000' })),
  getProjects: jest.fn(),
  createProject: jest.fn(),
}));

describe('Test component: HomePage', () => {
  let wrapper;
  window.crypto = {
    getRandomValues: () => 0x16,
  };

  beforeEach(() => {
    wrapper = shallowMount(HomePage);
  });
  describe('Test variable initialization', () => {
    describe('Test variable: project', () => {
      it('Should match "project-00000000"', () => {
        expect(wrapper.vm.project).toEqual({ id: 'project-00000000' });
      });
    });
  });
});
