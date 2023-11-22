import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import NavigationBar from 'src/components/NavigationBar.vue';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import { Notify } from 'quasar';
import * as Git from 'src/composables/Git';
import { useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({
    name: 'Draw',
  })),
  useRouter: jest.fn(),
}));

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/events/FileEvent', () => ({
  GlobalUploadFilesEvent: {
    next: jest.fn(),
  },
}));

jest.mock('src/composables/events/GitEvent', () => ({
  AddRemoteEvent: {
    subscribe: jest.fn(),
  },
  AuthenticationEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  getProjectById: jest.fn((projectName) => {
    if (projectName === 'projectTest') {
      return { git: { repository: {}, username: 'username', token: 'token' } };
    }
    return {};
  }),
}));

jest.mock('src/composables/Git', () => ({
  gitGlobalUpload: jest.fn(),
}));

describe('Test component: NavigationBar', () => {
  let wrapper;
  let addRemoteSubscribe;
  let addRemoteUnsubscribe;
  let authenticationSubscribe;
  let authenticationUnsubscribe;
  let mockPush;

  const globalUploadFilesEvent = jest.fn();

  FileEvent.GlobalUploadFilesEvent.next.mockImplementation(globalUploadFilesEvent);
  Git.gitGlobalUpload.mockImplementation(
    (project) => (project.git ? Promise.resolve() : Promise.reject()),
  );

  beforeEach(() => {
    addRemoteSubscribe = jest.fn();
    addRemoteUnsubscribe = jest.fn();
    authenticationSubscribe = jest.fn();
    authenticationUnsubscribe = jest.fn();
    mockPush = jest.fn();

    GitEvent.AddRemoteEvent.subscribe.mockImplementation(() => {
      addRemoteSubscribe();
      return { unsubscribe: addRemoteUnsubscribe };
    });
    GitEvent.AuthenticationEvent.subscribe.mockImplementation(() => {
      authenticationSubscribe();
      return { unsubscribe: authenticationUnsubscribe };
    });
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    wrapper = shallowMount(NavigationBar, {
      props: {
        projectName: 'projectTest',
      },
      global: {
        components: {
          'router-link': 'a',
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: projectName', () => {
      it('should match "projectTest"', () => {
        expect(wrapper.vm.props.projectName).toEqual('projectTest');
      });
    });

    describe('Test ref: buttonToggleValue', () => {
      it('should match "Draw"', () => {
        expect(wrapper.vm.buttonToggleValue).toEqual('Draw');
      });
    });
  });

  describe('Test computed: buttonToggleOptions', () => {
    it('should equal buttonToggleOpitons array ', () => {
      const buttonToggleOptions = [{
        label: 'page.modelizer.header.switch.draw',
        value: 'Draw',
        slot: 'content',
      }, {
        label: 'page.modelizer.header.switch.text',
        value: 'Text',
        slot: 'content',
      }];

      expect(wrapper.vm.buttonToggleOptions).toEqual(buttonToggleOptions);
    });
  });

  describe('Test computed: isUploadButtonVisible', () => {
    it('should return true if project git repository is defined', () => {
      expect(wrapper.vm.isUploadButtonVisible).toEqual(true);
    });

    it('should return false if project git config is not defined', () => {
      wrapper.vm.project = {};

      expect(wrapper.vm.isUploadButtonVisible).toEqual(false);
    });

    it('should return false if project git repository is not defined', () => {
      wrapper.vm.project = { git: {} };

      expect(wrapper.vm.isUploadButtonVisible).toEqual(false);
    });
  });

  describe('Test computed: isUploadButtonDisable', () => {
    it('should return false if both project git username and git token are defined', () => {
      expect(wrapper.vm.isUploadButtonDisable).toEqual(false);
    });

    it('should return true if both project git username and git token are not defined', () => {
      wrapper.vm.project = { git: { repository: {} } };

      expect(wrapper.vm.isUploadButtonDisable).toEqual(true);
    });

    it('should return true if project git username is defined and git token is not defined', () => {
      wrapper.vm.project = { git: { repository: {}, username: 'username' } };

      expect(wrapper.vm.isUploadButtonDisable).toEqual(true);
    });

    it('should return true if project git username is not defined and git token is defined', () => {
      wrapper.vm.project = { git: { repository: {}, token: 'token' } };

      expect(wrapper.vm.isUploadButtonDisable).toEqual(true);
    });

    it('should return true if project git config is not defined', () => {
      wrapper.vm.project = {};

      expect(wrapper.vm.isUploadButtonDisable).toEqual(true);
    });
  });

  describe('Test computed: uploadButtonTitle', () => {
    it('should return enable title if both project git username and git token are defined', () => {
      expect(wrapper.vm.uploadButtonTitle).toEqual('page.modelizer.header.button.upload.enable.title');
    });

    it('should return disable title if both project git username and git token are not defined', () => {
      wrapper.vm.project = { git: { repository: {} } };

      expect(wrapper.vm.uploadButtonTitle).toEqual('page.modelizer.header.button.upload.disable.title');
    });
  });

  describe('Test function: upload', () => {
    it('should emit GlobalUploadFilesEvent and emit a positive notification on success', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.upload();

      expect(globalUploadFilesEvent).toHaveBeenCalledTimes(1);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a negative notification on error', async () => {
      wrapper.vm.project = {};

      Notify.create = jest.fn();

      await wrapper.vm.upload();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });

  describe('Test function: setProject', () => {
    it('should update project value', () => {
      wrapper.vm.project = {};
      wrapper.vm.setProject();
      expect(wrapper.vm.project).toEqual({
        git: {
          repository: {},
          token: 'token',
          username: 'username',
        },
      });
    });
  });

  describe('Test funtion: onViewTypeUpdate', () => {
    it('should call router.push with newViewType', () => {
      wrapper.vm.onViewTypeUpdate('changed');
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith({
        name: 'changed',
        params: {
          projectName: wrapper.vm.props.projectName,
        },
        query: wrapper.vm.query,
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to AddRemoteEvent', () => {
      expect(addRemoteSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to AddRemoteEvent', () => {
      expect(authenticationSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to AddRemoteEvent', () => {
      expect(addRemoteUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(addRemoteUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to AddRemoteEvent', () => {
      expect(authenticationUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(authenticationUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
