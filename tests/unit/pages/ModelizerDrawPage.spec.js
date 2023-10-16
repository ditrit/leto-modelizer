import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { Notify } from 'quasar';
import ModelizerDrawPage from 'src/pages/ModelizerDrawPage.vue';
import PluginManager from 'src/composables/PluginManager';
import TemplateManager from 'src/composables/TemplateManager';
import PluginEvent from 'src/composables/events/PluginEvent';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      projectName: 'project-00000000',
      viewType: 'model',
    },
    query: {
      path: 'path',
      plugin: 'plugin',
    },
  }),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: jest.fn(() => ({
    data: {
      name: 'pluginName',
      addComponent: jest.fn(),
      definitions: {
        components: [
          { type: 'testComponent', isTemplate: false, icon: 'icon' },
        ],
      },
    },
    configuration: {
      defaultFileName: 'defaultFileName',
    },
    draw: jest.fn(),
    arrangeComponentsPosition: jest.fn(() => Promise.resolve()),
    resetDrawerActions: jest.fn(),
    addComponent: jest.fn(),
  })),
  initComponents: jest.fn(() => Promise.resolve()),
  renderConfiguration: jest.fn(() => Promise.resolve()),
  renderModel: jest.fn(() => Promise.resolve()),
  addNewTemplateComponent: jest.fn(() => Promise.resolve()),
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplatesByType: jest.fn(() => Promise.resolve()),
}));

jest.mock('src/composables/Project', () => ({
  getModelFiles: jest.fn(() => Promise.resolve([])),
}));

jest.mock('src/composables/events/PluginEvent', () => ({
  DefaultEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test page component: ModelizerDrawPage', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();

    PluginEvent.DefaultEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(ModelizerDrawPage);
  });

  describe('Test function: onDefaultEvent', () => {
    it('should call renderConfiguration if event.action is "move"', async () => {
      const param = {
        event: {
          type: 'Drawer', action: 'move',
        },
      };

      await wrapper.vm.onDefaultEvent(param);

      expect(PluginManager.renderConfiguration).toBeCalledWith('project-00000000', 'path', wrapper.vm.data.plugin);
    });

    it('should call renderModel if event.action is either "update", "delete" or "add"', async () => {
      let param = {
        event: {
          type: 'Drawer', action: 'update',
        },
      };

      await wrapper.vm.onDefaultEvent(param);

      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.data.plugin);

      param = {
        event: {
          type: 'Drawer', action: 'delete',
        },
      };
      await wrapper.vm.onDefaultEvent(param);

      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.data.plugin);

      param = {
        event: {
          type: 'Drawer', action: 'add',
        },
      };
      await wrapper.vm.onDefaultEvent(param);

      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.data.plugin);
    });
  });

  describe('Test function: arrangeComponentsPosition', () => {
    it('should arrange a component position and redraw on click', async () => {
      await wrapper.vm.arrangeComponentsPosition();

      expect(wrapper.vm.data.plugin.arrangeComponentsPosition).toHaveBeenCalled();
      expect(wrapper.vm.data.plugin.draw).toHaveBeenCalledWith('root');
    });
  });

  describe('Test function: initView', () => {
    it('should call draw with "root" parameter', async () => {
      const initComponentsMock = jest.fn(() => Promise.resolve());

      PluginManager.initComponents.mockImplementation(initComponentsMock);
      expect(initComponentsMock).toHaveBeenCalledTimes(0);

      await wrapper.vm.initView();

      expect(wrapper.vm.data.plugin.draw).toHaveBeenCalledWith('root');
      expect(PluginManager.initComponents).toBeCalled();
    });

    it('should emit a notification on error when updating component templates', async () => {
      Notify.create = jest.fn();
      TemplateManager.getTemplatesByType.mockImplementation(() => Promise.reject());

      await wrapper.vm.initView();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });

  describe('Test function: dropHandler', () => {
    it('should call plugin.addComponent if component is not a template and call renderModel', async () => {
      const param = {
        dataTransfer: {
          getData: jest.fn(() => ('{"isTemplate":false,"definitionType":"testComponent"}')),
        },
      };

      await wrapper.vm.dropHandler(param);

      expect(wrapper.vm.data.plugin.addComponent).toBeCalled();
      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.data.plugin);
    });

    it('should call addNewTemplateComponent if component is a template and call renderModel', async () => {
      const param = {
        dataTransfer: {
          getData: jest.fn(() => ('{"isTemplate":true,"definitionType":"testComponent"}')),
        },
      };

      await wrapper.vm.dropHandler(param);

      expect(PluginManager.addNewTemplateComponent).toBeCalled();
      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.data.plugin);
    });

    it('should emit a notification on error when adding a new template component', async () => {
      Notify.create = jest.fn();
      PluginManager.addNewTemplateComponent.mockImplementation(() => Promise.reject());

      const param = {
        dataTransfer: {
          getData: jest.fn(() => ('{"isTemplate":true,"definitionType":"testComponent"}')),
        },
      };

      await wrapper.vm.dropHandler(param);

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe DefaultEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe DefaultEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
