import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { useRouter, useRoute } from 'vue-router';
import ModelizerPage from 'src/pages/ModelizerPage.vue';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

jest.mock('components/dialog/GitAuthenticationDialog', () => {});
jest.mock('components/card/GitBranchCard', () => {});

describe('Test page component: ModelizerPage', () => {
  let wrapper;
  const push = jest.fn();

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
      viewType: 'model',
    },
  }));
  useRouter.mockImplementation(() => ({
    push,
  }));

  beforeEach(() => {
    wrapper = shallowMount(ModelizerPage, {
      global: {
        stubs: [
          'router-link',
          'router-view',
          'modelizer-navigation-bar',
          'modelizer-draw-view',
          'modelizer-text-view',
        ],
      },
      stubs: {
        GitSettingsDialog: true,
        GitBranchCard: true,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test computed: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });

    describe('Test computed: viewType', () => {
      it('should match "model"', () => {
        expect(wrapper.vm.viewType).toEqual('model');
      });
    });
  });
});
