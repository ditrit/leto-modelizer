import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import GitBranchCard from 'src/components/card/GitBranchCard.vue';
import { useRoute } from 'vue-router';
import GitEvent from 'src/composables/events/GitEvent';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  getCurrentBranch: jest.fn(() => Promise.resolve('main')),
}));

jest.mock('src/composables/events/GitEvent', () => ({
  UpdateRemoteEvent: {
    subscribe: jest.fn(),
  },
  CheckoutEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test component: GitBranchCard', () => {
  let wrapper;
  let updateRemoteSubscribe;
  let checkoutSubscribe;
  let updateRemoteUnsubscribe;
  let checkoutUnsubscribe;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
    },
  }));

  beforeEach(() => {
    updateRemoteSubscribe = jest.fn();
    checkoutSubscribe = jest.fn();
    updateRemoteUnsubscribe = jest.fn();
    checkoutUnsubscribe = jest.fn();
    GitEvent.UpdateRemoteEvent.subscribe.mockImplementation(() => {
      updateRemoteSubscribe();
      return { unsubscribe: updateRemoteUnsubscribe };
    });
    GitEvent.CheckoutEvent.subscribe.mockImplementation(() => {
      checkoutSubscribe();
      return { unsubscribe: checkoutUnsubscribe };
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
      expect(updateRemoteSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to CheckoutEvent', () => {
      expect(checkoutSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to UpdateRemoteEvent', () => {
      expect(updateRemoteUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(updateRemoteUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to Checkout', () => {
      expect(checkoutUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(checkoutUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
