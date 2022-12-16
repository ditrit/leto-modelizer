import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import GitNewBranchForm from 'src/components/form/GitNewBranchForm.vue';
import { Notify } from 'quasar';
import GitEvent from 'src/composables/events/GitEvent';
import Project from 'src/composables/Project';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/Project', () => ({
  getBranches: jest.fn(() => Promise.resolve([{ name: 'test' }])),
  createBranchFrom: jest.fn((id) => {
    if (id === 'error') {
      return Promise.reject({ name: 'error' });
    }
    return Promise.resolve();
  }),
  gitCheckout: jest.fn(() => Promise.resolve('checkout')),
}));

jest.mock('src/composables/events/GitEvent', () => ({
  NewBranchEvent: {
    next: jest.fn(),
  },
  CheckoutEvent: {
    next: jest.fn(),
  },
}));

describe('Test component: GitNewBranchForm', () => {
  let wrapper;
  let checkoutNext;
  let gitCheckoutMock;

  beforeEach(() => {
    checkoutNext = jest.fn();
    gitCheckoutMock = jest.fn();

    GitEvent.CheckoutEvent.next.mockImplementation(checkoutNext);
    Project.gitCheckout.mockImplementation(() => Promise.resolve(gitCheckoutMock()));

    wrapper = shallowMount(GitNewBranchForm, {
      props: {
        projectName: 'test',
        branchName: 'test',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "test"', () => {
        expect(wrapper.vm.props.projectName).toEqual('test');
      });
    });

    describe('Test props: branchName', () => {
      it('should match "test"', () => {
        expect(wrapper.vm.props.branchName).toEqual('test');
      });
    });

    describe('Test variable: branches', () => {
      it('should be an array containing one element', () => {
        expect(wrapper.vm.branches).toEqual([{ name: 'test' }]);
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit "git-branch:create" event, emit NewBranchEvent and a notification on success', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.submitting).toEqual(false);
      expect(wrapper.emitted()['git-branch:create']).toBeTruthy();
      expect(GitEvent.NewBranchEvent.next).toHaveBeenCalledTimes(1);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should call gitCheckout and emit Checkout event if checkout is true on success', async () => {
      wrapper.vm.checkout = true;

      await wrapper.vm.onSubmit();

      expect(gitCheckoutMock).toHaveBeenCalled();
      expect(checkoutNext).toHaveBeenCalledTimes(1);
    });

    it('should not call gitCheckout nor emit Checkout event if checkout is false on success', async () => {
      wrapper.vm.checkout = false;

      await wrapper.vm.onSubmit();

      expect(gitCheckoutMock).not.toHaveBeenCalled();
      expect(checkoutNext).not.toHaveBeenCalled();
    });

    it('should emit a notification on error', async () => {
      wrapper = shallowMount(GitNewBranchForm, {
        props: {
          projectName: 'error',
          branchName: 'test',
        },
      });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
