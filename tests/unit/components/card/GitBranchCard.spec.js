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
}));

describe('Test component: GitBranchCard', () => {
  let wrapper;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
    },
  }));

  beforeEach(() => {
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

  describe('Test hook function: onMounted', () => {
  });

  describe('Test hook function: onUnmounted', () => {
  });
});
