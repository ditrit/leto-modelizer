import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { Notify } from 'quasar';
import ModelizerDrawPage from 'pages/ModelizerDrawPage.vue';
import PluginManager from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';
import DrawerEvent from 'src/composables/events/DrawerEvent';
import FileEvent from 'src/composables/events/FileEvent';
import { useRouter } from 'vue-router';

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
  useRouter: jest.fn(() => ({
    push: () => Promise.resolve(),
  })),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: jest.fn(() => ({
    data: {
      name: 'pluginName',
      getComponentById: jest.fn(() => ({ id: 2 })),
      addComponent: jest.fn(),
      removeComponentById: jest.fn(),
      definitions: {
        components: [
          { type: 'testComponent', isTemplate: false, icon: 'icon' },
        ],
      },
      scene: {
        selection: [],
        selectionRef: null,
      },
    },
    configuration: {
      defaultFileName: 'defaultFileName',
    },
    draw: jest.fn(),
    initDrawer: jest.fn(),
    arrangeComponentsPosition: jest.fn(),
    resetDrawerActions: jest.fn(),
    addComponent: jest.fn(),
    resize: jest.fn(),
    exportSvg: jest.fn(() => 'content'),
  })),
  initComponents: jest.fn(() => Promise.resolve([])),
  renderConfiguration: jest.fn(() => Promise.resolve()),
  renderModel: jest.fn(() => Promise.resolve()),
  addNewTemplateComponent: jest.fn(() => Promise.resolve()),
}));

jest.mock('src/composables/Project', () => ({
  getModelFiles: jest.fn(() => Promise.resolve([])),
}));

jest.mock('src/composables/events/PluginEvent', () => ({
  DefaultEvent: {
    subscribe: jest.fn(),
  },
  RequestEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/events/DrawerEvent', () => ({
  next: jest.fn(),
  subscribe: jest.fn(),
}));

jest.mock('src/composables/events/FileEvent', () => ({
  SelectFileTabEvent: {
    next: jest.fn(),
  },
}));

describe('Test page component: ModelizerDrawPage', () => {
  let wrapper;
  let pluginDefaultSubscribe;
  let pluginDefaultUnsubscribe;
  let pluginRequestSubscribe;
  let pluginRequestUnsubscribe;
  let drawerEventSubscribe;
  let drawerEventUnsubscribe;
  let push;

  beforeEach(() => {
    pluginDefaultSubscribe = jest.fn();
    pluginDefaultUnsubscribe = jest.fn();
    pluginRequestSubscribe = jest.fn();
    pluginRequestUnsubscribe = jest.fn();
    drawerEventSubscribe = jest.fn();
    drawerEventUnsubscribe = jest.fn();
    push = jest.fn(() => Promise.resolve());

    useRouter.mockImplementation(() => ({
      push,
    }));

    PluginEvent.DefaultEvent.subscribe.mockImplementation(() => {
      pluginDefaultSubscribe();
      return { unsubscribe: pluginDefaultUnsubscribe };
    });

    PluginEvent.RequestEvent.subscribe.mockImplementation(() => {
      pluginRequestSubscribe();
      return { unsubscribe: pluginRequestUnsubscribe };
    });

    DrawerEvent.subscribe.mockImplementation(() => {
      drawerEventSubscribe();
      return { unsubscribe: drawerEventUnsubscribe };
    });

    wrapper = shallowMount(ModelizerDrawPage);
  });

  describe('Test function: getStyle', () => {
    it('should set offset and return valid style', () => {
      wrapper.vm.offset = 0;

      expect(wrapper.vm.getStyle(100)).toEqual({
        'min-height': 'calc(100vh - 100px)',
        'max-height': 'calc(100vh - 100px)',
      });
      expect(wrapper.vm.offset).toEqual(100);
    });
  });

  describe('Test function: onDefaultEvent', () => {
    it('should call renderConfiguration if event.action is "move"', async () => {
      const param = {
        event: {
          type: 'Drawer', action: 'move',
        },
      };

      await wrapper.vm.onDefaultEvent(param);

      expect(PluginManager.renderConfiguration).toBeCalledWith('project-00000000', 'path', wrapper.vm.plugin);
    });

    it('should call renderModel if event.action is either "update", "delete" or "add"', async () => {
      let param = {
        event: {
          type: 'Drawer', action: 'update',
        },
      };

      await wrapper.vm.onDefaultEvent(param);

      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.plugin);

      param = {
        event: {
          type: 'Drawer', action: 'delete',
        },
      };
      await wrapper.vm.onDefaultEvent(param);

      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.plugin);

      param = {
        event: {
          type: 'Drawer', action: 'add',
        },
      };
      await wrapper.vm.onDefaultEvent(param);

      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.plugin);
    });
  });

  describe('Test function: onDrawerEvent', () => {
    it('should do nothing on invalid event key', () => {
      wrapper.vm.splitterKey = null;
      wrapper.vm.onDrawerEvent({ key: 'ConsoleFooter', type: 'open' });
      expect(wrapper.vm.splitterKey).toEqual(null);
    });

    it('should set all variable on valid event', () => {
      wrapper.vm.componentId = null;
      wrapper.vm.splitterKey = null;
      wrapper.vm.isVisible = false;
      wrapper.vm.splitter = 100;
      wrapper.vm.onDrawerEvent({ key: 'ComponentDetailPanel', type: 'open', id: 'id_1' });
      expect(wrapper.vm.componentId).toEqual('id_1');
      expect(wrapper.vm.splitterKey).toEqual('ComponentDetailPanel');
      expect(wrapper.vm.isVisible).toEqual(true);
      expect(wrapper.vm.splitter).toEqual(60);

      wrapper.vm.onDrawerEvent({ key: 'ComponentDetailPanel', type: 'close' });
      expect(wrapper.vm.componentId).toEqual(null);
      expect(wrapper.vm.splitterKey).toEqual('ComponentDetailPanel');
      expect(wrapper.vm.isVisible).toEqual(false);
      expect(wrapper.vm.splitter).toEqual(100);
    });

    it('should set next state for AIDrawer on valid event', () => {
      wrapper.vm.aiDrawerNextState = null;
      wrapper.vm.onDrawerEvent({ key: 'AIChatDrawer', type: 'open' });
      expect(wrapper.vm.aiDrawerNextState).toEqual('close');

      wrapper.vm.onDrawerEvent({ key: 'AIChatDrawer', type: 'close' });
      expect(wrapper.vm.aiDrawerNextState).toEqual('open');
    });
  });

  describe('Test function: arrangeComponentsPosition', () => {
    it('should arrange a component position and redraw on click', async () => {
      await wrapper.vm.arrangeComponentsPosition();

      expect(wrapper.vm.plugin.arrangeComponentsPosition).toHaveBeenCalled();
      expect(wrapper.vm.plugin.draw).toHaveBeenCalled();
    });
  });

  describe('Test function: initView', () => {
    it('should call draw with "view-port" parameter', async () => {
      const initComponentsMock = jest.fn(() => Promise.resolve([]));

      PluginManager.initComponents.mockImplementation(initComponentsMock);
      expect(initComponentsMock).toHaveBeenCalledTimes(0);

      await wrapper.vm.initView();

      expect(PluginManager.initComponents).toHaveBeenCalled();
      expect(wrapper.vm.plugin.initDrawer).toHaveBeenCalledWith('view-port', false);
      expect(wrapper.vm.plugin.draw).toHaveBeenCalled();
    });
  });

  describe('Test function: exportSvg', () => {
    it('should call exportSvg with "view-port" parameter', () => {
      global.URL.createObjectURL = jest.fn();
      global.URL.revokeObjectURL = jest.fn();
      expect(wrapper.vm.plugin.exportSvg).toHaveBeenCalledTimes(0);

      wrapper.vm.exportSvg();

      expect(wrapper.vm.plugin.exportSvg).toHaveBeenCalledWith('view-port');
    });
  });

  describe('Test function: dropHandler', () => {
    it('should call plugin.addComponent if component is not a template and call renderModel', async () => {
      const param = {
        dataTransfer: {
          getData: jest.fn(() => (JSON.stringify({
            definition: {
              isTemplate: false,
            },
          }))),
        },
      };

      await wrapper.vm.dropHandler(param);

      expect(wrapper.vm.plugin.addComponent).toBeCalled();
      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.plugin);
    });

    it('should call addNewTemplateComponent if component is a template and call renderModel', async () => {
      const param = {
        dataTransfer: {
          getData: jest.fn(() => (JSON.stringify({
            definition: {
              isTemplate: true,
            },
          }))),
        },
      };

      await wrapper.vm.dropHandler(param);

      expect(PluginManager.addNewTemplateComponent).toBeCalled();
      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.plugin);
    });

    it('should emit a notification on error when adding a new template component', async () => {
      Notify.create = jest.fn();
      PluginManager.addNewTemplateComponent.mockImplementation(() => Promise.reject());

      const param = {
        dataTransfer: {
          getData: jest.fn(() => (JSON.stringify({
            definition: {
              isTemplate: true,
            },
          }))),
        },
      };

      await wrapper.vm.dropHandler(param);

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });

  describe('Test function: onRequestEvent', () => {
    it('should resize and draw', async () => {
      await wrapper.vm.initView();

      wrapper.vm.plugin.resize.mockClear();
      wrapper.vm.plugin.draw.mockClear();

      wrapper.vm.onRequestEvent({ type: 'fitToContent', id: 1 });

      expect(wrapper.vm.plugin.resize).toBeCalledWith(1);
      expect(wrapper.vm.plugin.draw).toBeCalled();
    });

    it('should arrange components position and draw', async () => {
      await wrapper.vm.initView();

      wrapper.vm.plugin.arrangeComponentsPosition.mockClear();
      wrapper.vm.plugin.draw.mockClear();

      wrapper.vm.onRequestEvent({ type: 'arrangeContent', id: 1 });

      expect(wrapper.vm.plugin.arrangeComponentsPosition).toBeCalledWith(1, false);
      expect(wrapper.vm.plugin.draw).toBeCalled();
    });

    it('should remove component and draw', async () => {
      await wrapper.vm.initView();

      wrapper.vm.plugin.data.removeComponentById.mockClear();
      wrapper.vm.plugin.draw.mockClear();

      wrapper.vm.onRequestEvent({ type: 'delete', id: 1 });

      expect(wrapper.vm.plugin.data.removeComponentById).toBeCalledWith(1);
      expect(wrapper.vm.plugin.draw).toBeCalled();
      expect(DrawerEvent.next).toBeCalledWith({ type: 'close', key: 'ComponentDetailPanel' });
    });

    it('should create component, setLink, arrange position and draw', async () => {
      await wrapper.vm.initView();

      const component = {
        id: null,
        setLinkAttribute: jest.fn(),
      };

      wrapper.vm.plugin.data.getComponentById = jest.fn((id) => {
        component.id = id;
        return component;
      });
      wrapper.vm.plugin.arrangeComponentsPosition.mockClear();
      wrapper.vm.plugin.draw.mockClear();

      wrapper.vm.onRequestEvent({
        type: 'linkToDefinition',
        id: 1,
        data: {
          componentDefinition: 'componentDefinition',
          linkDefinition: 'linkDefinition',
        },
      });

      expect(component.id).toEqual(1);
      expect(component.setLinkAttribute).toBeCalled();
      expect(wrapper.vm.plugin.arrangeComponentsPosition).toBeCalledWith(null, true);
      expect(wrapper.vm.plugin.draw).toBeCalled();
    });

    it('should create component, setLink and draw', async () => {
      await wrapper.vm.initView();

      const component = {
        id: null,
        setLinkAttribute: jest.fn(),
      };

      wrapper.vm.plugin.data.getComponentById = jest.fn((id) => {
        component.id = id;
        return component;
      });
      wrapper.vm.plugin.draw.mockClear();

      wrapper.vm.onRequestEvent({
        type: 'linkToComponent',
        id: 1,
        data: {
          target: 2,
          linkDefinition: 'linkDefinition',
        },
      });

      expect(component.id).toEqual(1);
      expect(component.setLinkAttribute).toBeCalled();
      expect(wrapper.vm.plugin.draw).toBeCalled();
    });

    it('should create component, arrange position and draw', async () => {
      await wrapper.vm.initView();

      wrapper.vm.plugin.addComponent.mockClear();
      wrapper.vm.plugin.arrangeComponentsPosition.mockClear();
      wrapper.vm.plugin.draw.mockClear();

      wrapper.vm.onRequestEvent({
        type: 'addComponentToContainer',
        id: 1,
        data: {
          definition: 'definition',
        },
      });

      expect(wrapper.vm.plugin.addComponent).toBeCalledWith(
        1,
        'definition',
        'project-00000000/path',
      );
      expect(wrapper.vm.plugin.arrangeComponentsPosition).toBeCalledWith(1, true);
      expect(wrapper.vm.plugin.draw).toBeCalled();
    });

    it('should create component, arrange position and draw', () => {
      DrawerEvent.next.mockClear();

      wrapper.vm.onRequestEvent({
        type: 'edit',
        id: 1,
      });

      expect(DrawerEvent.next).toBeCalledWith({
        type: 'open',
        key: 'ComponentDetailPanel',
        id: 1,
      });
    });

    it('should select component and draw', () => {
      DrawerEvent.next.mockClear();

      wrapper.vm.onRequestEvent({
        type: 'select',
        ids: [1],
      });
      expect(wrapper.vm.plugin.draw).toBeCalled();
    });

    it('should go to editor page and send event to set active file', async () => {
      FileEvent.SelectFileTabEvent.next.mockClear();
      const router = useRouter();
      router.push.mockClear();

      await wrapper.vm.onRequestEvent({
        type: 'openFile',
        path: 'main.tf',
      });

      expect(router.push).toBeCalledWith({
        name: 'Text',
        params: {
          projectName: 'project-00000000',
        },
        query: {
          path: 'path',
          plugin: 'plugin',
        },
      });
      expect(FileEvent.SelectFileTabEvent.next).toBeCalledWith('main.tf');
    });
  });

  describe('Test function: askAI', () => {
    it('should call DrawerEvent twice', () => {
      DrawerEvent.next.mockClear();
      wrapper.vm.askAI();

      expect(DrawerEvent.next).toHaveBeenCalledTimes(2);
      expect(DrawerEvent.next.mock.calls).toEqual([
        [{ key: 'ComponentDetailPanel', type: 'close' }],
        [{ key: 'AIChatDrawer', type: 'open' }],
      ]);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe DefaultEvent', () => {
      expect(pluginDefaultSubscribe).toHaveBeenCalledTimes(1);
      expect(pluginRequestSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe DrawerEvent', () => {
      expect(drawerEventSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe PluginEvent', () => {
      expect(pluginDefaultUnsubscribe).toHaveBeenCalledTimes(0);
      expect(pluginRequestUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pluginDefaultUnsubscribe).toHaveBeenCalledTimes(1);
      expect(pluginRequestUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe DrawerEvent', () => {
      expect(drawerEventUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(drawerEventUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
