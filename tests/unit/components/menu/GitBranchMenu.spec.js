import DialogEvent from 'src/composables/events/DialogEvent';
import { shallowMount } from '@vue/test-utils';
import GitBranchMenu from 'components/menu/GitBranchMenu';
import { useRoute } from 'vue-router';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import Project from 'src/composables/Project';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  getBranches: jest.fn(() => Promise.resolve([])),
  gitFetch: jest.fn(() => Promise.resolve()),
  getProjectById: jest.fn(),
}));

describe('Test component: GitBranchMenu', () => {
  let wrapper;
  let gitFetchMock;
  let setBranchesMock;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
      viewType: 'model',
    },
  }));

  beforeEach(() => {
    gitFetchMock = jest.fn();

    Project.gitFetch.mockImplementation(() => Promise.resolve(gitFetchMock()));

    wrapper = shallowMount(GitBranchMenu, {
      props: {
        currentBranchName: 'main',
      },
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });

    wrapper.vm.menu = {
      hide: jest.fn(),
    };
  });

  describe('Test computed', () => {
    describe('Test computed: hasNoBranches', () => {
      it('should be true when allBranches is an empty array', () => {
        wrapper.vm.allBranches = [];

        expect(wrapper.vm.hasNoBranches).toEqual(true);
      });
      it('should be false when allbranches has at least one element', () => {
        wrapper.vm.allBranches = [1];

        expect(wrapper.vm.hasNoBranches).toEqual(false);
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: openDialog', () => {
      it('should call dialog event with the given key and hide menu', () => {
        DialogEvent.next = jest.fn();
        wrapper.vm.menu = {
          hide: jest.fn(),
        };

        wrapper.vm.openDialog('GitStatus');
        expect(DialogEvent.next).toHaveBeenCalledWith(({ key: 'GitStatus', branch: 'main', type: 'open' }));
        expect(wrapper.vm.menu.hide).toBeCalled();
      });
    });

    describe('Test function: filterAndSort', () => {
      beforeEach(() => {
        wrapper.vm.allBranches = [
          {
            onLocal: true,
            onRemote: false,
            name: 'test',
          },
          {
            onLocal: true,
            onRemote: true,
            name: 'master',
          },
          {
            onLocal: true,
            onRemote: true,
            name: 'feature',
          },
          {
            onLocal: false,
            onRemote: true,
            name: 'improvement',
          },
        ];

        wrapper.vm.isSearched = jest.fn(() => true);
      });

      it('should filter and sort localBranches correctly', () => {
        wrapper.vm.filterAndSort(wrapper.vm.allBranches, 'onLocal');

        expect(wrapper.vm.localBranches).toEqual([
          {
            onLocal: true,
            onRemote: true,
            name: 'feature',
          },
          {
            onLocal: true,
            onRemote: true,
            name: 'master',
          },
          {
            onLocal: true,
            onRemote: false,
            name: 'test',
          },
        ]);
      });

      it('should filter and sort remoteBranches correctly', () => {
        wrapper.vm.filterAndSort(wrapper.vm.allBranches, 'onRemote');

        expect(wrapper.vm.remoteBranches).toEqual([
          {
            onLocal: true,
            onRemote: true,
            name: 'feature',
          },
          {
            onLocal: false,
            onRemote: true,
            name: 'improvement',
          },
          {
            onLocal: true,
            onRemote: true,
            name: 'master',
          },
        ]);
      });

      it('should display currentBranch at the top of localBranches list', async () => {
        await wrapper.setProps({
          currentBranchName: 'test',
        });

        wrapper.vm.filterAndSort(wrapper.vm.allBranches, 'onLocal');

        expect(wrapper.vm.localBranches).toEqual([
          {
            onLocal: true,
            onRemote: false,
            name: 'test',
          },
          {
            onLocal: true,
            onRemote: true,
            name: 'feature',
          },
          {
            onLocal: true,
            onRemote: true,
            name: 'master',
          },
        ]);
      });

      it('should display currentBranch at the top of remoteBranches list', async () => {
        await wrapper.setProps({
          currentBranchName: 'improvement',
        });

        wrapper.vm.filterAndSort(wrapper.vm.allBranches, 'onRemote');

        expect(wrapper.vm.remoteBranches).toEqual([
          {
            onLocal: false,
            onRemote: true,
            name: 'improvement',
          },
          {
            onLocal: true,
            onRemote: true,
            name: 'feature',
          },
          {
            onLocal: true,
            onRemote: true,
            name: 'master',
          },
        ]);
      });
    });

    describe('Test function: manageExpandMenu', () => {
      it('should invert local value', () => {
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.manageExpandMenu(true);
        expect(wrapper.vm.showLocal).toEqual(true);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.manageExpandMenu(true);
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);
      });

      it('should invert remote value', () => {
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);

        wrapper.vm.manageExpandMenu();
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(true);

        wrapper.vm.manageExpandMenu();
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);
      });
    });

    describe('Test function: setBranches', () => {
      it('should call gitFetch and getBranches to set allBranches value', async () => {
        wrapper.vm.loading = true;

        await wrapper.vm.setBranches();

        expect(gitFetchMock).toHaveBeenCalled();
        expect(wrapper.vm.allBranches).toEqual([]);
        expect(wrapper.vm.loading).toBeFalsy();
      });
    });

    describe('Test function: onShow', () => {
      it('should call searchInput focus', () => {
        const focus = jest.fn();
        wrapper.vm.searchInput = { focus };
        wrapper.vm.onShow();
        expect(focus).toBeCalled();
      });
    });

    describe('Test function: onOpen', () => {
      it('should call setBranches and close expand menus', () => {
        setBranchesMock = jest.fn();
        wrapper.vm.setBranches = setBranchesMock();
        wrapper.vm.showLocal = true;
        wrapper.vm.showRemote = true;
        wrapper.vm.onOpen();
        expect(setBranchesMock).toBeCalled();
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(false);
      });
    });
  });
});
