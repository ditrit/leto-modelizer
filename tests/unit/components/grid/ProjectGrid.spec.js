import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ProjectGrid from 'src/components/grid/ProjectGrid.vue';
import { createProjectTemplate, initProject } from 'src/composables/Project';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { useRouter } from 'vue-router';

installQuasarPlugin();

jest.mock('src/composables/Project', () => ({
  createProjectTemplate: jest.fn(() => ({ id: 'test' })),
  initProject: jest.fn(() => Promise.resolve()),
}));

jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

describe('Test component: ProjectGrid', () => {
  let wrapper;
  const push = jest.fn();

  useRouter.mockImplementation(() => ({ push }));

  beforeEach(() => {
    wrapper = shallowMount(ProjectGrid, {
      props: {
        projects: [{ id: 'test' }],
      },
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: definitions', () => {
      it('should match array of projects', () => {
        expect(wrapper.vm.projects).toStrictEqual([{ id: 'test' }]);
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: createProject', () => {
      it('should create and init project then redirect to its model page', async () => {
        await wrapper.vm.createProject();
        expect(createProjectTemplate).toBeCalled();
        expect(initProject).toBeCalled();
        expect(push).toBeCalledWith('/modelizer/test/models');
      });
    });
  });
});
