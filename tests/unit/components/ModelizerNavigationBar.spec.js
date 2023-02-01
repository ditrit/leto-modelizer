import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerNavigationBar from 'src/components/ModelizerNavigationBar.vue';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import PluginEvent from 'src/composables/events/PluginEvent';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import { Notify } from 'quasar';
import Project from 'src/composables/Project';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/events/ViewSwitchEvent', () => ({
  next: jest.fn(),
}));

jest.mock('src/composables/events/PluginEvent', () => ({
  ParseEvent: {
    next: jest.fn(),
  },
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
  gitGlobalUpload: jest.fn(),
  getProjectById: jest.fn((projectName) => {
    if (projectName === 'projectTest') {
      return { git: { repository: {}, username: 'username', token: 'token' } };
    }
    return {};
  }),
}));

describe('Test component: ModelizerNavigationBar', () => {
  let wrapper;
  let addRemoteSubscribe;
  let addRemoteUnsubscribe;
  let authenticationSubscribe;
  let authenticationUnsubscribe;

  const viewSwitchEvent = jest.fn();
  const parseEvent = jest.fn();
  const globalUploadFilesEvent = jest.fn();

  ViewSwitchEvent.next.mockImplementation(viewSwitchEvent);
  PluginEvent.ParseEvent.next.mockImplementation(parseEvent);
  FileEvent.GlobalUploadFilesEvent.next.mockImplementation(globalUploadFilesEvent);
  Project.gitGlobalUpload.mockImplementation(
    (project) => (project.git ? Promise.resolve() : Promise.reject()),
  );

  beforeEach(() => {
    addRemoteSubscribe = jest.fn();
    addRemoteUnsubscribe = jest.fn();
    authenticationSubscribe = jest.fn();
    authenticationUnsubscribe = jest.fn();

    GitEvent.AddRemoteEvent.subscribe.mockImplementation(() => {
      addRemoteSubscribe();
      return { unsubscribe: addRemoteUnsubscribe };
    });
    GitEvent.AuthenticationEvent.subscribe.mockImplementation(() => {
      authenticationSubscribe();
      return { unsubscribe: authenticationUnsubscribe };
    });

    wrapper = shallowMount(ModelizerNavigationBar, {
      props: {
        viewType: 'model',
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
    describe('Test prop: viewType', () => {
      it('should match "model"', () => {
        expect(wrapper.vm.props.viewType).toEqual('model');
      });
    });

    describe('Test prop: projectName', () => {
      it('should match "projectTest"', () => {
        expect(wrapper.vm.props.projectName).toEqual('projectTest');
      });
    });

    describe('Test ref: buttonToggleValue', () => {
      it('should match "model"', () => {
        expect(wrapper.vm.props.viewType).toEqual('model');
      });
    });
  });

  describe('Test computed: buttonToggleOptions', () => {
    it('should equal buttonToggleOpitons array ', () => {
      const buttonToggleOptions = [{
        label: 'page.modelizer.header.switch.model',
        value: 'model',
        slot: 'content',
      }, {
        label: 'page.modelizer.header.switch.text',
        value: 'text',
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

  describe('Test funtion: onViewSwitchUpdate', () => {
    it('should not emit ViewSwitchEvent without viewSwitch changed', () => {
      wrapper.vm.onViewSwitchUpdate('model');
      expect(viewSwitchEvent).toHaveBeenCalledTimes(0);
    });

    it('should emit ViewSwitchEvent on viewSwitch change', () => {
      wrapper.vm.onViewSwitchUpdate('changed');
      expect(viewSwitchEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test watcher: props.viewType', () => {
    it('should be trigger when props.viewType is update with a different value', async () => {
      await wrapper.setProps({
        viewType: 'text',
        projectName: 'projectTest',
      });
      expect(wrapper.vm.buttonToggleValue).toEqual('text');
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
