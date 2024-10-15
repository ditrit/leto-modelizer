import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
import ModelizerSettingsMenu from 'src/components/menu/ModelizerSettingsMenu.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import GitEvent from 'src/composables/events/GitEvent';
import { setActivePinia, createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { getUserPicture } from 'src/services/ImageDownloadService';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  next: jest.fn(),
}));

jest.mock('src/composables/events/GitEvent', () => ({
  AddRemoteEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/services/ImageDownloadService', () => ({
  getUserPicture: jest.fn(() => Promise.resolve('avatar')),
}));

const vCanMock = {
  inserted(el, binding) {
    el.setAttribute('data-v-can-mock', binding.value);
  },
};
const global = {
  directives: {
    can: vCanMock,
  },
  plugins: [
    createI18n({
      locale: 'en-US',
      messages: i18nConfiguration,
    }),
  ],
};

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

    setActivePinia(createPinia());

    GitEvent.AddRemoteEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = mount(ModelizerSettingsMenu, {
      props: {
        projectName: 'test',
      },
      global,
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "test"', () => {
        expect(wrapper.vm.props.projectName).toEqual('test');
      });
    });

    describe('Test ref: user', () => {
      it('should not match an empty object', () => {
        // the pinia object is a big object so just checking that
        // the userStore is not an empty object.
        expect(wrapper.vm.userStore).not.toEqual({});
      });
    });

    describe('Test computed: hasRepository', () => {
      it('should be false when no git repository is defined', () => {
        wrapper = mount(ModelizerSettingsMenu, {
          props: {
            projectName: 'noGit',
          },
          global,
        });
        expect(wrapper.vm.hasRepository).toEqual(false);
      });

      it('should be true when a git repository is defined', () => {
        expect(wrapper.vm.hasRepository).toEqual(true);
      });
    });

    describe('Test computed: menuItems', () => {
      it('should display "GitAddRemote" menu when no git repository is defined', () => {
        wrapper = mount(ModelizerSettingsMenu, {
          props: {
            projectName: 'noGit',
          },
          global,
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

  describe('Test function: loadUserPicture', () => {
    it('Should set avatar on success', async () => {
      wrapper.vm.userPicture = null;
      getUserPicture.mockImplementation(() => Promise.resolve('avatar'));

      await wrapper.vm.loadUserPicture();

      expect(wrapper.vm.userPicture).toEqual('avatar');
    });

    it('Should set null on error', async () => {
      wrapper.vm.userPicture = 'test';
      getUserPicture.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadUserPicture();

      expect(wrapper.vm.userPicture).toEqual(null);
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
