import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount, flushPromises } from '@vue/test-utils';
import GitBranchCard from 'src/components/card/GitBranchCard.vue';
import { useRoute } from 'vue-router';
import GitEvent from 'src/composables/events/GitEvent';
import FileEvent from 'src/composables/events/FileEvent';
import Project from 'src/composables/Project';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  getCurrentBranch: jest.fn(() => Promise.resolve('main')),
}));

jest.mock('src/composables/events/GitEvent', () => ({
  AddRemoteEvent: {
    subscribe: jest.fn(),
  },
  CheckoutEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/events/FileEvent', () => ({
  GlobalSaveFilesEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test component: GitBranchCard', () => {
  let wrapper;
  let addRemoteSubscribe;
  let addRemoteUnsubscribe;
  let checkoutSubscribe;
  let checkoutUnsubscribe;
  let globalSaveFilesSubscribe;
  let globalSaveFilesUnsubscribe;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
    },
  }));

  beforeEach(() => {
    addRemoteSubscribe = jest.fn();
    addRemoteUnsubscribe = jest.fn();
    checkoutSubscribe = jest.fn();
    checkoutUnsubscribe = jest.fn();
    globalSaveFilesSubscribe = jest.fn();
    globalSaveFilesUnsubscribe = jest.fn();
    GitEvent.AddRemoteEvent.subscribe.mockImplementation(() => {
      addRemoteSubscribe();
      return { unsubscribe: addRemoteUnsubscribe };
    });
    GitEvent.CheckoutEvent.subscribe.mockImplementation(() => {
      checkoutSubscribe();
      return { unsubscribe: checkoutUnsubscribe };
    });
    FileEvent.GlobalSaveFilesEvent.subscribe.mockImplementation(() => {
      globalSaveFilesSubscribe();
      return { unsubscribe: globalSaveFilesUnsubscribe };
    });

    wrapper = shallowMount(GitBranchCard, {});
  });

  describe('Test props initialization', () => {
    describe('Test prop: currentBranch', () => {
      it('should match "main"', () => {
        expect(wrapper.vm.currentBranch).toStrictEqual('main');
      });
    });
    describe('Test prop: loading', () => {
      it('should be false', () => {
        expect(wrapper.vm.loading).toBeFalsy();
      });
    });
  });

  describe('Test function: updateBranch', () => {
    it('should get current Branch then update currentBranch with the return value', async () => {
      wrapper.vm.loading = true;
      expect(wrapper.vm.currentBranch).toEqual('main');

      Project.getCurrentBranch.mockReturnValueOnce(Promise.resolve('test'));

      await wrapper.vm.updateBranch();
      await flushPromises();

      expect(wrapper.vm.currentBranch).toEqual('test');
      expect(wrapper.vm.loading).toBeFalsy();
    });
  });

  describe('Test function: setCurrentBranch', () => {
    it('should set currentBranch equal to the param', () => {
      wrapper.vm.setCurrentBranch('newBranch');

      expect(wrapper.vm.currentBranch).toEqual('newBranch');
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to AddRemoteEvent', () => {
      expect(addRemoteSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to CheckoutEvent', () => {
      expect(checkoutSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to GlobalSaveFilesEvent', () => {
      expect(globalSaveFilesSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to AddRemoteEvent', () => {
      expect(addRemoteUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(addRemoteUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to CheckoutEvent', () => {
      expect(checkoutUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(checkoutUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to GlobalSaveFilesEvent', () => {
      expect(globalSaveFilesUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(globalSaveFilesUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
