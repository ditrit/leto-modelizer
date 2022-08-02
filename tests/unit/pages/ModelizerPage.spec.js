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
          'modelizer-model-view',
          'modelizer-text-view',
        ],
      },
    });
  });

  describe('Test variable initialization', () => {
    describe('Test computed: projectName', () => {
      it('Should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });

    describe('Test computed: viewType', () => {
      it('Should match "model"', () => {
        expect(wrapper.vm.viewType).toEqual('model');
      });
    });

    describe('Test variable: viewSwitchSubscription', () => {
      it('Should match "model"', () => {
        expect(wrapper.vm.viewSwitchSubscription.unsubscribe)
          .toBeInstanceOf(Function);
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

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ViewSwitchEvent', () => {
      const unsubscribe = jest.fn();
      wrapper.vm.viewSwitchSubscription.unsubscribe = unsubscribe;
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
