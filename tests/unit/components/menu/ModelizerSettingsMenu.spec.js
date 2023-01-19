import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerSettingsMenu from 'src/components/menu/ModelizerSettingsMenu.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import GitEvent from 'src/composables/events/GitEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  next: jest.fn(),
}));

jest.mock('src/composables/events/GitEvent', () => ({
  AddRemoteEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  getProjectById: jest.fn((id) => {
    if (id === 'noGit') {
      return { id };
    }
    return {
      id,
      git: {
        repository: 'testRepository',
        username: 'testUsername',
        token: 'testToken',
      },
    };
  }),
}));

describe('Test component: ModelizerSettingsMenu', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  const emit = jest.fn();

  DialogEvent.next.mockImplementation(() => emit());

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();

    GitEvent.AddRemoteEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(ModelizerSettingsMenu, {
      props: {
        projectName: 'test',
      },
      mocks: {
        DialogEvent,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "test"', () => {
        expect(wrapper.vm.props.projectName).toEqual('test');
      });
    });

    describe('Test computed: hasRepository', () => {
      it('should be false when no git repository is defined', () => {
        wrapper = shallowMount(ModelizerSettingsMenu, {
          props: {
            projectName: 'noGit',
          },
        });
        expect(wrapper.vm.hasRepository).toEqual(false);
      });

      it('should be true when a git repository is defined', () => {
        expect(wrapper.vm.hasRepository).toEqual(true);
      });
    });

    describe('Test computed: menuItems', () => {
      it('should display "GitAddRemote" menu when no git repository is defined', () => {
        wrapper = shallowMount(ModelizerSettingsMenu, {
          props: {
            projectName: 'noGit',
          },
        });
        expect(wrapper.vm.menuItems).toEqual([
          {
            key: 'GitAddRemote',
            icon: 'fa-solid fa-book-bookmark',
            title: 'page.modelizer.settings.gitAddRemote.title',
            visible: true,
          },
          {
            key: 'GitAuthentication',
            icon: 'fa-brands fa-git-alt',
            title: 'page.modelizer.settings.gitAuthentication.title',
            visible: true,
          },
        ]);
      });

      it('should not display "GitAddRemote" menu when a git repository is defined', () => {
        expect(wrapper.vm.menuItems).toEqual([
          {
            key: 'GitAddRemote',
            icon: 'fa-solid fa-book-bookmark',
            title: 'page.modelizer.settings.gitAddRemote.title',
            visible: false,
          },
          {
            key: 'GitAuthentication',
            icon: 'fa-brands fa-git-alt',
            title: 'page.modelizer.settings.gitAuthentication.title',
            visible: true,
          },
        ]);
      });
    });
  });

  describe('Test function: onClick', () => {
    it('should emit an event', () => {
      expect(emit).not.toHaveBeenCalled();
      wrapper.vm.onClick();
      expect(emit).toBeCalled();
    });
  });

  describe('Test function: setProject', () => {
    it('should update project value', () => {
      wrapper.vm.project = {};
      wrapper.vm.setProject();
      expect(wrapper.vm.project).toEqual({
        id: 'test',
        git: {
          repository: 'testRepository',
          username: 'testUsername',
          token: 'testToken',
        },
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to AddRemoteEvent', async () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to AddRemoteEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
