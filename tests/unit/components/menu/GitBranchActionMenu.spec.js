import { shallowMount } from '@vue/test-utils';
import GitBranchActionMenu from 'components/menu/GitBranchActionMenu';
import { useRoute } from 'vue-router';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import DialogEvent from 'src/composables/events/DialogEvent';
import { Notify } from 'quasar';
import GitEvent from 'src/composables/events/GitEvent';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/Git', () => ({
  gitCheckout: jest.fn((_, id) => {
    if (id === 'error') {
      return Promise.reject(() => 'error');
    }
    return Promise.resolve();
  }),
}));

jest.mock('src/composables/events/GitEvent', () => ({
  CheckoutEvent: {
    next: jest.fn(),
  },
}));

describe('Test component: GitBranchActionMenu', () => {
  let wrapper;
  let checkoutNext;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
      viewType: 'model',
    },
  }));

  beforeEach(() => {
    checkoutNext = jest.fn();

    GitEvent.CheckoutEvent.next.mockImplementation(checkoutNext);

    wrapper = shallowMount(GitBranchActionMenu, {
      props: {
        branchName: 'main',
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
      it('should emit "action:done" and emit CheckoutEvent on success', async () => {
        wrapper.vm.loading.checkout = true;
        await wrapper.vm.onCheckout();

        expect(wrapper.emitted()['action:done']).toBeTruthy();
        expect(checkoutNext).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.loading.checkout).toEqual(false);
      });

      it('should emit a negative notification on error', async () => {
        wrapper.vm.loading.checkout = true;

        await wrapper.setProps({ branchName: 'error' });
        Notify.create = jest.fn();

        await wrapper.vm.onCheckout();

        expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
        expect(wrapper.vm.loading.checkout).toEqual(false);
      });
    });

    describe('Test function: openDialog', () => {
      it('should emit "action:done" event and call DialogEvent with "GitNewBranch"', () => {
        DialogEvent.next = jest.fn();

        wrapper.vm.openDialog('GitNewBranch');
        expect(wrapper.emitted()['action:done']).toBeTruthy();
        expect(DialogEvent.next).toHaveBeenCalledWith(expect.objectContaining({ key: 'GitNewBranch' }));
      });
    });
  });
});
