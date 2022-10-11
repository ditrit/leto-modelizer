import { shallowMount } from '@vue/test-utils';
import GitBranchActionMenu from 'components/menu/GitBranchActionMenu';
import { useRoute } from 'vue-router';
import { checkout } from 'src/composables/Project';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  checkout: jest.fn(() => Promise.resolve('checkout')),
}));

describe('Test component: GitBranchActionMenu', () => {
  let wrapper;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
      viewType: 'model',
    },
  }));

  beforeEach(() => {
    wrapper = shallowMount(GitBranchActionMenu, {
      props: {
        branchName: 'main',
      },
      global: {
        plugins: [
          createI18n(i18nConfiguration),
        ],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test variable: loading', () => {
      it('Should be false', () => {
        expect(wrapper.vm.loading).toEqual({ checkout: false });
      });
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: branchName', () => {
      it('Should match "main"', () => {
        expect(wrapper.vm.branchName).toStrictEqual('main');
      });
    });

    describe('Test prop: current', () => {
      it('Should be false', () => {
        expect(wrapper.vm.current).toBeFalsy();
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: onCheckout', () => {
      it('Should call checkout action', async () => {
        wrapper.vm.loading.checkout = true;
        await wrapper.vm.onCheckout();

        expect(wrapper.vm.loading.checkout).toEqual(false);
        expect(checkout).toBeCalled();
      });
    });
  });
});
