import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { useRouter, useRoute } from 'vue-router';
import ModelizerPage from 'src/pages/ModelizerPage.vue';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

jest.mock('src/composables/events/ViewSwitchEvent', () => ({
  subscribe: jest.fn(),
}));

jest.mock('components/dialog/GitSettingsDialog', () => {});
jest.mock('components/card/GitBranchCard', () => {});

describe('Test page component: ModelizerPage', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;
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
    subscribe = jest.fn();
    unsubscribe = jest.fn();
    ViewSwitchEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });
    wrapper = shallowMount(ModelizerPage, {
      global: {
        stubs: [
          'router-link',
          'router-view',
          'modelizer-navigation-bar',
          'modelizer-model-view',
          'modelizer-text-view',
        ],
      },
      stubs: {
        GitSettingsDialog: true,
        GitBranchCard: true,
      },
      mocks: {
        ViewSwitchEvent,
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

  describe('Test function: changeView', () => {
    it('should call router.push', () => {
      expect(wrapper.vm.viewType).toEqual('model');
      wrapper.vm.changeView('text');
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenLastCalledWith({
        name: 'modelizer',
        params: {
          viewType: 'text',
          projectName: 'project-00000000',
        },
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe ViewSwitchEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ViewSwitchEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
