import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerNavigationBar from 'src/components/ModelizerNavigationBar.vue';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import PluginEvent from 'src/composables/events/PluginEvent';
import { Notify } from 'quasar';
import { gitGlobalSave } from 'src/composables/Project';

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
  RenderEvent: {
    next: jest.fn(),
  },
  ParseEvent: {
    next: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  gitGlobalSave: jest.fn(),
  getProjectById: jest.fn((projectName) => {
    if (projectName === 'projectTest') {
      return { git: { repository: {} } };
    }
    return {};
  }),
}));

describe('Test component: ModelizerNavigationBar', () => {
  let wrapper;
  const emit = jest.fn();
  const renderEvent = jest.fn();
  const parseEvent = jest.fn();

  ViewSwitchEvent.next.mockImplementation(() => emit());
  PluginEvent.RenderEvent.next.mockImplementation(renderEvent);
  PluginEvent.ParseEvent.next.mockImplementation(parseEvent);
  gitGlobalSave.mockImplementation(
    (project) => (project.git ? Promise.resolve() : Promise.reject()),
  );

  beforeEach(() => {
    wrapper = shallowMount(ModelizerNavigationBar, {
      props: {
        viewType: 'model',
        projectName: 'projectTest',
      },
      mocks: {
        ViewSwitchEvent,
      },
      global: {
        components: {
          'router-link': 'a',
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: viewType', () => {
      it('should match "model"', () => {
        expect(wrapper.vm.props.viewType).toEqual('model');
      });
    });

    describe('Test props: projectName', () => {
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

  describe('Test computed: isSaveButtonDisable', () => {
    it('should return false if project git repository is defined', () => {
      expect(wrapper.vm.isSaveButtonDisable).toEqual(false);
    });

    it('should return true if project git repository is not defined', async () => {
      await wrapper.setProps({
        viewType: 'model',
        projectName: 'WrongProjectTest',
      });

      expect(wrapper.vm.isSaveButtonDisable).toEqual(true);
    });
  });

  describe('Test computed: savebuttonTitle', () => {
    it('should return enable title if project git repository is defined', () => {
      expect(wrapper.vm.savebuttonTitle).toEqual('page.modelizer.header.button.save.enable.title');
    });

    it('should return disable title if project git repository is not defined', async () => {
      await wrapper.setProps({
        viewType: 'model',
        projectName: 'WrongProjectTest',
      });

      expect(wrapper.vm.savebuttonTitle).toEqual('page.modelizer.header.button.save.disable.title');
    });
  });

  describe('Test functions: save', () => {
    it('should emit a positive notification on success', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.save();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a negative notification on error', async () => {
      await wrapper.setProps({
        viewType: 'model',
        projectName: 'WrongProjectTest',
      });

      Notify.create = jest.fn();

      await wrapper.vm.save();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });

  describe('Test functions: onViewSwitchUpdate', () => {
    it('should not emit ViewSwitch event when newViewType is equal to props.viewType', () => {
      expect(emit).not.toHaveBeenCalled();
      wrapper.vm.onViewSwitchUpdate('model');
      expect(emit).not.toHaveBeenCalled();
    });

    it('should emit ViewSwitch and RenderEvent events'
      + 'when newViewType is not equal to props.viewType and is "text"', () => {
      expect(emit).not.toHaveBeenCalled();
      expect(renderEvent).not.toHaveBeenCalled();
      wrapper.vm.onViewSwitchUpdate('text');
      expect(emit).toHaveBeenCalledTimes(1);
      expect(renderEvent).toHaveBeenCalledTimes(1);
    });

    it('should emit ViewSwitch and ParseEvent events'
      + 'when newViewType is not equal to props.viewType and is "model"', async () => {
      await wrapper.setProps({
        viewType: 'text',
        projectName: 'projectTest',
      });
      expect(emit).toHaveBeenCalledTimes(1);
      expect(parseEvent).not.toHaveBeenCalled();
      wrapper.vm.onViewSwitchUpdate('model');
      expect(emit).toHaveBeenCalledTimes(2);
      expect(parseEvent).toHaveBeenCalledTimes(1);
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
});
