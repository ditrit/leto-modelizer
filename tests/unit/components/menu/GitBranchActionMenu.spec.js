import { shallowMount } from '@vue/test-utils';
import GitBranchActionMenu from 'components/menu/GitBranchActionMenu';
import { useRoute } from 'vue-router';
import { checkout } from 'src/composables/Project';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import DialogEvent from 'src/composables/events/DialogEvent';

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
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test variable: loading', () => {
      it('should be false', () => {
        expect(wrapper.vm.loading).toEqual({ checkout: false });
      });
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: branchName', () => {
      it('should match "main"', () => {
        expect(wrapper.vm.branchName).toStrictEqual('main');
      });
    });

    describe('Test prop: current', () => {
      it('should be false', () => {
        expect(wrapper.vm.current).toBeFalsy();
      });
    });

    describe('Test prop: onLocal', () => {
      it('should be false', () => {
        expect(wrapper.vm.onLocal).toBeFalsy();
      });
    });

    describe('Test prop: onRemote', () => {
      it('should be false', () => {
        expect(wrapper.vm.onRemote).toBeFalsy();
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: onCheckout', () => {
      it('should call checkout action', async () => {
        wrapper.vm.loading.checkout = true;
        await wrapper.vm.onCheckout();

        expect(wrapper.vm.loading.checkout).toEqual(false);
        expect(checkout).toBeCalled();
      });
    });

    describe('Test function: onNewBranch', () => {
      it('should call dialog event and hide menu', () => {
        DialogEvent.next = jest.fn();
        wrapper.vm.menu = {
          hide: jest.fn(),
        };

        wrapper.vm.onNewBranch();
        expect(DialogEvent.next).toBeCalled();
        expect(wrapper.vm.menu.hide).toBeCalled();
      });
    });

    describe('Test function: onUpdate', () => {
      it('should call dialog event and hide menu', () => {
        DialogEvent.next = jest.fn();
        wrapper.vm.menu = {
          hide: jest.fn(),
        };

        wrapper.vm.onUpdate();
        expect(DialogEvent.next).toBeCalled();
        expect(wrapper.vm.menu.hide).toBeCalled();
      });
    });

    describe('Test function: onPush', () => {
      it('should call dialog event and hide menu', () => {
        DialogEvent.next = jest.fn();
        wrapper.vm.menu = {
          hide: jest.fn(),
        };

        wrapper.vm.onPush();
        expect(DialogEvent.next).toBeCalled();
        expect(wrapper.vm.menu.hide).toBeCalled();
      });
    });
  });
});
