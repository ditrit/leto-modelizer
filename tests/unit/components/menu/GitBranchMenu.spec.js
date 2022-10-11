import DialogEvent from 'src/composables/events/DialogEvent';
import { shallowMount } from '@vue/test-utils';
import GitBranchMenu from 'components/menu/GitBranchMenu';
import { useRoute } from 'vue-router';
import { getBranches } from 'src/composables/Project';
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
}));

jest.mock('src/composables/Project', () => ({
  getCurrentBranch: jest.fn(() => Promise.resolve('main')),
  getBranches: jest.fn(() => Promise.resolve([])),
  fetchGit: jest.fn(() => Promise.resolve()),
  getProjectById: jest.fn(),
}));

describe('Test component: GitBranchMenu', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
      viewType: 'model',
    },
  }));

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();
    GitEvent.FetchEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
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
      it('Should be true without local and remote branches', () => {
        wrapper.vm.filteredBranches.local = [];
        wrapper.vm.filteredBranches.remote = [];

        expect(wrapper.vm.hasNoBranches).toEqual(true);
      });
      it('Should be false with local branches', () => {
        wrapper.vm.filteredBranches.local = [1];
        wrapper.vm.filteredBranches.remote = [];

        expect(wrapper.vm.hasNoBranches).toEqual(false);
      });
      it('Should be false with remote branches', () => {
        wrapper.vm.filteredBranches.local = [];
        wrapper.vm.filteredBranches.remote = [1];

        expect(wrapper.vm.hasNoBranches).toEqual(false);
      });
      it('Should be false with local and remote branches', () => {
        wrapper.vm.filteredBranches.local = [1];
        wrapper.vm.filteredBranches.remote = [1];

        expect(wrapper.vm.hasNoBranches).toEqual(false);
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: isSearched', () => {
      it('Should return true on match', () => {
        wrapper.vm.searchBranch = '';
        expect(wrapper.vm.isSearched('test')).toEqual(true);

        wrapper.vm.searchBranch = 's';
        expect(wrapper.vm.isSearched('test')).toEqual(true);

        wrapper.vm.searchBranch = 'a test';
        expect(wrapper.vm.isSearched('test')).toEqual(true);
      });
    });

    describe('Test function: filter', () => {
      it('Should set branches correctly', () => {
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

      it('Should invert local value', () => {
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.openCloseExpandMenu(true);
        expect(wrapper.vm.showLocal).toEqual(true);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.openCloseExpandMenu(true);
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);
      });

      it('Should return all sorted branches without filter', async () => {
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

      it('Should return filtered branches', async () => {
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
      it('Should call focus and close expand menu', () => {
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

    describe('Test function: openCloseExpandMenu', () => {
      it('Should invert local value', () => {
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.openCloseExpandMenu(true);
        expect(wrapper.vm.showLocal).toEqual(true);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.openCloseExpandMenu(true);
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);
      });

      it('Should invert remote value', () => {
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
      it('Should be empty without any branches', async () => {
        getBranches.mockImplementation(() => Promise.resolve([]));
        await wrapper.vm.initBranches();
        expect(wrapper.vm.branches).toEqual({ local: [], remote: [] });
      });

      it('Should fill local branch array with all local branches', async () => {
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

      it('Should fill remote branch array with all remote branches', async () => {
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
      it('should subscribe ViewSwitchEvent', () => {
        expect(subscribe).toHaveBeenCalledTimes(1);
      });
    });

    describe('Test hook function: onUnmounted', () => {
      it('should unsubscribe ViewSwitchEvent', () => {
        expect(unsubscribe).toHaveBeenCalledTimes(0);
        wrapper.unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
      });
    });
  });
});
