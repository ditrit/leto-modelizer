import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import GitBranchCard from 'src/components/card/GitBranchCard.vue';
import { useRoute } from 'vue-router';
import UpdateRemoteEvent from 'src/composables/events/GitEvent';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  getCurrentBranch: jest.fn(() => Promise.resolve('main')),
}));

jest.mock('src/composables/events/GitEvent', () => ({
  subscribe: jest.fn(),
}));

describe('Test component: GitBranchCard', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
    },
  }));

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();
    UpdateRemoteEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(GitBranchCard, {});
  });

  describe('Test props initialization', () => {
    describe('Test prop: currentBranch', () => {
      it('Should match "main"', () => {
        expect(wrapper.vm.currentBranch).toStrictEqual('main');
      });
    });
    describe('Test prop: loading', () => {
      it('Should be false', () => {
        expect(wrapper.vm.loading).toBeFalsy();
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to UpdateRemoteEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to UpdateRemoteEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
