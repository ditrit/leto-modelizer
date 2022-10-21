import DialogEvent from 'src/composables/events/DialogEvent';
import { shallowMount } from '@vue/test-utils';
import GitBranchMenu from 'components/menu/GitBranchMenu';
import { useRoute } from 'vue-router';
import { getBranches, gitPrune } from 'src/composables/Project';
import Branch from 'src/models/git/Branch';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import GitEvent from 'src/composables/events/GitEvent';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/events/GitEvent', () => ({
  FetchEvent: {
    subscribe: jest.fn(),
  },
  CheckoutEvent: {
    subscribe: jest.fn(),
  },
  NewBranchEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  getCurrentBranch: jest.fn(() => Promise.resolve('main')),
  getBranches: jest.fn(() => Promise.resolve([])),
  fetchGit: jest.fn(() => Promise.resolve()),
  getProjectById: jest.fn(),
  gitPrune: jest.fn(() => Promise.resolve()),
}));

describe('Test component: GitBranchMenu', () => {
  let wrapper;
  let fetchSubscribe;
  let fetchUnsubscribe;
  let newBranchSubscribe;
  let checkoutSubscribe;
  let newBranchUnsubscribe;
  let checkoutUnsubscribe;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
      viewType: 'model',
    },
  }));

  beforeEach(() => {
    fetchSubscribe = jest.fn();
    fetchUnsubscribe = jest.fn();
    checkoutSubscribe = jest.fn();
    checkoutUnsubscribe = jest.fn();
    newBranchSubscribe = jest.fn();
    newBranchUnsubscribe = jest.fn();
    GitEvent.FetchEvent.subscribe.mockImplementation(() => {
      fetchSubscribe();
      return { unsubscribe: fetchUnsubscribe };
    });
    GitEvent.CheckoutEvent.subscribe.mockImplementation(() => {
      checkoutSubscribe();
      return { unsubscribe: checkoutUnsubscribe };
    });
    GitEvent.NewBranchEvent.subscribe.mockImplementation(() => {
      newBranchSubscribe();
      return { unsubscribe: newBranchUnsubscribe };
    });
    wrapper = shallowMount(GitBranchMenu, {
      props: {
        currentBranchName: 'main',
      },
      mocks: {
        DialogEvent,
      },
      global: {
        plugins: [
          createI18n(i18nConfiguration),
        ],
      },
    });
  });

  describe('Test computed', () => {
    describe('Test computed: hasNoBranches', () => {
      it('should be true without local and remote branches', () => {
        wrapper.vm.filteredBranches.local = [];
        wrapper.vm.filteredBranches.remote = [];

        expect(wrapper.vm.hasNoBranches).toEqual(true);
      });
      it('should be false with local branches', () => {
        wrapper.vm.filteredBranches.local = [1];
        wrapper.vm.filteredBranches.remote = [];

        expect(wrapper.vm.hasNoBranches).toEqual(false);
      });
      it('should be false with remote branches', () => {
        wrapper.vm.filteredBranches.local = [];
        wrapper.vm.filteredBranches.remote = [1];

        expect(wrapper.vm.hasNoBranches).toEqual(false);
      });
      it('should be false with local and remote branches', () => {
        wrapper.vm.filteredBranches.local = [1];
        wrapper.vm.filteredBranches.remote = [1];

        expect(wrapper.vm.hasNoBranches).toEqual(false);
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: newBranch', () => {
      it('should call dialog event', () => {
        DialogEvent.next = jest.fn();
        wrapper.vm.newBranch();
        expect(DialogEvent.next).toBeCalled();
      });
    });

    describe('Test function: isSearched', () => {
      it('should return true on match', () => {
        wrapper.vm.searchBranch = '';
        expect(wrapper.vm.isSearched('test')).toEqual(true);

        wrapper.vm.searchBranch = 's';
        expect(wrapper.vm.isSearched('test')).toEqual(true);

        wrapper.vm.searchBranch = 'a test';
        expect(wrapper.vm.isSearched('test')).toEqual(true);
      });
    });

    describe('Test function: filter', () => {
      it('should set branches correctly', () => {
        wrapper.vm.searchBranch = '';
        expect(wrapper.vm.isSearched('test')).toEqual(true);

        wrapper.vm.searchBranch = 's';
        expect(wrapper.vm.isSearched('test')).toEqual(true);

        wrapper.vm.searchBranch = 'a test';
        expect(wrapper.vm.isSearched('test')).toEqual(true);
      });
    });

    describe('Test function: openCloseExpandMenu', () => {
      const local = new Branch({
        name: 'Local',
        onLocal: true,
        onRemote: false,
      });
      const remote = new Branch({
        name: 'remote',
        onLocal: false,
        onRemote: true,
      });
      const both = new Branch({
        name: 'both',
        onLocal: true,
        onRemote: true,
      });

      it('should invert local value', () => {
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.openCloseExpandMenu(true);
        expect(wrapper.vm.showLocal).toEqual(true);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.openCloseExpandMenu(true);
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);
      });

      it('should return all sorted branches without filter', async () => {
        getBranches.mockImplementation(() => Promise.resolve([
          local,
          remote,
          both,
        ]));
        await wrapper.vm.initBranches();
        wrapper.vm.filter();
        expect(wrapper.vm.filteredBranches)
          .toEqual({
            local: [both, local],
            remote: [both, remote],
          });
      });

      it('should return filtered branches', async () => {
        wrapper.vm.searchedBranch = 'both';
        getBranches.mockImplementation(() => Promise.resolve([
          local,
          remote,
          both,
        ]));
        await wrapper.vm.initBranches();
        wrapper.vm.filter();
        expect(wrapper.vm.filteredBranches)
          .toEqual({
            local: [both],
            remote: [both],
          });
      });
    });

    describe('Test function: onOpenMenu', () => {
      it('should call focus and close expand menu', () => {
        const focus = jest.fn();
        wrapper.vm.searchInput = { focus };
        wrapper.vm.showLocal = true;
        wrapper.vm.showRemote = true;
        wrapper.vm.onOpenMenu();
        expect(focus).toBeCalled();
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);
      });
    });

    describe('Test function: onPrune', () => {
      it('should call gitPrune', async () => {
        expect(wrapper.vm.pruneLoader).toEqual(false);
        await wrapper.vm.onPrune();
        expect(gitPrune).toBeCalled();
        expect(wrapper.vm.pruneLoader).toEqual(false);
      });
    });

    describe('Test function: openCloseExpandMenu', () => {
      it('should invert local value', () => {
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.openCloseExpandMenu(true);
        expect(wrapper.vm.showLocal).toEqual(true);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.openCloseExpandMenu(true);
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);
      });

      it('should invert remote value', () => {
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.openCloseExpandMenu();
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(true);

        wrapper.vm.openCloseExpandMenu();
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);
      });
    });

    describe('Test function: initBranches', () => {
      it('should be empty without any branches', async () => {
        getBranches.mockImplementation(() => Promise.resolve([]));
        await wrapper.vm.initBranches();
        expect(wrapper.vm.branches).toEqual({ local: [], remote: [] });
      });

      it('should fill local branch array with all local branches', async () => {
        getBranches.mockImplementation(() => Promise.resolve([
          new Branch({
            name: 'Local',
            onLocal: true,
          }),
        ]));
        await wrapper.vm.initBranches();
        expect(wrapper.vm.branches).toEqual({
          local: [
            new Branch({
              name: 'Local',
              onLocal: true,
            }),
          ],
          remote: [],
        });
      });

      it('should fill remote branch array with all remote branches', async () => {
        getBranches.mockImplementation(() => Promise.resolve([
          new Branch({
            name: 'remote',
            onRemote: true,
          }),
        ]));
        await wrapper.vm.initBranches();
        expect(wrapper.vm.branches).toEqual({
          local: [],
          remote: [
            new Branch({
              name: 'remote',
              onRemote: true,
            }),
          ],
        });
      });
    });

    describe('Test hook function: onMounted', () => {
      it('should subscribe FetchEvent', () => {
        expect(fetchSubscribe).toHaveBeenCalledTimes(1);
      });

      it('should subscribe CheckoutEvent', () => {
        expect(checkoutSubscribe).toHaveBeenCalledTimes(1);
      });

      it('should subscribe NewBranchEvent', () => {
        expect(newBranchSubscribe).toHaveBeenCalledTimes(1);
      });
    });

    describe('Test hook function: onUnmounted', () => {
      it('should unsubscribe FetchEvent', () => {
        expect(fetchUnsubscribe).toHaveBeenCalledTimes(0);
        wrapper.unmount();
        expect(fetchUnsubscribe).toHaveBeenCalledTimes(1);
      });

      it('should unsubscribe CheckoutEvent', () => {
        expect(checkoutUnsubscribe).toHaveBeenCalledTimes(0);
        wrapper.unmount();
        expect(checkoutUnsubscribe).toHaveBeenCalledTimes(1);
      });

      it('should unsubscribe NewBranchEvent', () => {
        expect(newBranchUnsubscribe).toHaveBeenCalledTimes(0);
        wrapper.unmount();
        expect(newBranchUnsubscribe).toHaveBeenCalledTimes(1);
      });
    });
  });
});
