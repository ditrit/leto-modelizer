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

  describe('Test functions', () => {
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

        wrapper.vm.openCloseExpandMenu(false);
        expect(wrapper.vm.showLocal).toEqual(false);
        expect(wrapper.vm.showRemote).toEqual(true);

        wrapper.vm.openCloseExpandMenu(false);
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
