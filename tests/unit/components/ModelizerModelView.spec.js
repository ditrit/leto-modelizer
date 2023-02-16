import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerModelView from 'src/components/ModelizerModelView.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import PluginManager from 'src/composables/PluginManager';
import Project from 'src/composables/Project';
import TemplateManager from 'src/composables/TemplateManager';
import { Notify } from 'quasar';
import { useRoute, useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('src/composables/events/PluginEvent', () => ({
  InitEvent: {
    subscribe: jest.fn(),
  },
  ParseEvent: {
    subscribe: jest.fn(),
  },
  RenderEvent: {
    next: jest.fn(),
    subscribe: jest.fn(),
  },
  DrawEvent: {
    subscribe: jest.fn(),
  },
  UpdateEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(),
  deleteComponent: jest.fn(),
  getPluginByName: jest.fn(),
  getFileInputs: jest.fn(),
  renderModel: jest.fn(() => [{ path: 'path' }]),
  renderPlugin: jest.fn(() => Promise.resolve([])),
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplatesByType: jest.fn(() => Promise.resolve([{ plugin: 'plugin', isTemplate: true }, {
    type: 'component one',
    isTemplate: true,
    files: ['app.tf'],
    key: 'testTemplate',
    plugin: 'pluginName',
  }])),
  getTemplateFileByPath: jest.fn(),
  generateTemplate: jest.fn((text) => text),
}));

jest.mock('src/composables/Project', () => ({
  getProjectFiles: jest.fn(),
  readProjectFile: jest.fn(),
  appendProjectFile: jest.fn(),
  readDir: jest.fn(),
}));

describe('Test component: ModelizerModelView', () => {
  let wrapper;
  let initSubscribe;
  let initUnsubscribe;
  let parseSubscribe;
  let parseUnsubscribe;
  let renderSubscribe;
  let renderUnsubscribe;
  let drawSubscribe;
  let drawUnsubscribe;
  let updateSubscribe;
  let updateUnsubscribe;
  let pluginParse;
  let pluginDraw;
  let useRouterPush;
  let pluginRenderNext;
  let appendProjectFileMock;
  let testPlugin;

  beforeEach(() => {
    initSubscribe = jest.fn();
    initUnsubscribe = jest.fn();
    parseSubscribe = jest.fn();
    parseUnsubscribe = jest.fn();
    renderSubscribe = jest.fn();
    renderUnsubscribe = jest.fn();
    drawSubscribe = jest.fn();
    drawUnsubscribe = jest.fn();
    updateSubscribe = jest.fn();
    updateUnsubscribe = jest.fn();
    pluginParse = jest.fn();
    pluginDraw = jest.fn();
    useRouterPush = jest.fn();
    pluginRenderNext = jest.fn();
    appendProjectFileMock = jest.fn();

    useRoute.mockImplementation(() => ({
      params: {
        projectName: 'project-00000000',
        viewType: 'model',
      },
      query: {
        path: 'path',
      },
    }));
    useRouter.mockImplementation(() => ({
      push: useRouterPush,
    }));

    Project.appendProjectFile.mockImplementation(() => Promise.resolve(appendProjectFileMock()));
    TemplateManager.getTemplateFileByPath.mockImplementation(() => Promise.resolve({ data: 'template file content' }));

    PluginEvent.InitEvent.subscribe.mockImplementation(() => {
      initSubscribe();
      return { unsubscribe: initUnsubscribe };
    });
    PluginEvent.ParseEvent.subscribe.mockImplementation(() => {
      parseSubscribe();
      return { unsubscribe: parseUnsubscribe };
    });
    PluginEvent.RenderEvent.subscribe.mockImplementation(() => {
      renderSubscribe();
      return { unsubscribe: renderUnsubscribe };
    });
    PluginEvent.DrawEvent.subscribe.mockImplementation(() => {
      drawSubscribe();
      return { unsubscribe: drawUnsubscribe };
    });
    PluginEvent.UpdateEvent.subscribe.mockImplementation(() => {
      updateSubscribe();
      return { unsubscribe: updateUnsubscribe };
    });
    PluginEvent.RenderEvent.next.mockImplementation(pluginRenderNext);

    testPlugin = {
      data: {
        name: 'pluginName',
        addComponent: jest.fn(),
        definitions: {
          components: [
            { type: 'testComponent', isTemplate: false, icon: 'icon' },
          ],
        },
      },
      parse: pluginParse,
      draw: pluginDraw,
    };

    Project.getProjectFiles.mockImplementation(() => Promise.resolve([{}]));
    Project.readProjectFile.mockImplementation(() => Promise.resolve({ id: 'TEST' }));
    Project.readDir.mockImplementation(() => Promise.resolve([]));

    PluginManager.getPlugins.mockImplementation(() => [{ data: { name: 'pluginName' } }]);
    PluginManager.deleteComponent.mockImplementation((componentId, components) => {
      const index = components.findIndex(({ id }) => id === componentId);
      if (index === -1) {
        return false;
      }
      components.splice(index, 1);
      return true;
    });
    PluginManager.getPlugins.mockImplementation(() => []);
    PluginManager.getPluginByName.mockImplementation(() => testPlugin);
    PluginManager.getFileInputs.mockImplementation(() => []);

    wrapper = shallowMount(ModelizerModelView, {
      props: {
        projectName: 'project-00000000',
      },
    });
  });

  describe('Test function: renderModelComponents', () => {
    it('should emit RenderEvent with rendered files', async () => {
      await wrapper.vm.renderModelComponents();

      expect(pluginRenderNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: updatePluginsAndTemplates', () => {
    it('should update data.plugins, call drawComponents and update component templates on success', async () => {
      await wrapper.vm.updatePluginsAndTemplates();

      expect(wrapper.vm.data.plugin).toEqual(expect.objectContaining({ data: expect.objectContaining({ name: 'pluginName' }) }));
      expect(wrapper.vm.templates).toEqual(expect.arrayContaining([{ plugin: 'plugin', isTemplate: true }]));
    });

    it('should emit a negative notification on error after failing to retrieve templates', async () => {
      TemplateManager.getTemplatesByType.mockReturnValueOnce(Promise.reject());

      Notify.create = jest.fn();

      await wrapper.vm.updatePluginsAndTemplates();

      expect(Notify.create).toHaveBeenCalledWith({
        message: 'errors.templates.getData',
        html: true,
        type: 'negative',
      });
    });
  });

  describe('Test function: dropHandler', () => {
    let event;

    beforeEach(() => {
      event = {
        preventDefault: jest.fn(),
        dataTransfer: {
          getData: jest.fn(),
        },
      };
    });

    it.each([
      ['', 'path'],
      ['test', 'test/path'],
    ])(`should add component to plugin, call renderModel then emit RenderEvent 
    when dropping a plugin component with models path set to "%s"`, async (modelFolder, destinationPath) => {
      process.env.MODELS_DEFAULT_FOLDER = modelFolder;

      event.dataTransfer.getData.mockReturnValueOnce(JSON.stringify({
        isTemplate: false,
        pluginName: 'pluginName',
        definitionType: 'testComponent',
      }));

      await wrapper.vm.dropHandler(event);

      expect(testPlugin.data.addComponent).toBeCalledWith({ type: 'testComponent', isTemplate: false, icon: 'icon' }, `${destinationPath}/`);
      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', destinationPath, expect.objectContaining({
        data: expect.objectContaining({ name: 'pluginName' }),
      }));
      expect(PluginEvent.RenderEvent.next).toBeCalled();
    });

    it.each([
      ['', 'path'],
      ['test', 'test/path'],
    ])(`should call appendProjectFile, renderModel then emit RenderEvent 
    when dropping a template component with models path set to "%s"`, async (modelFolder, destinationPath) => {
      process.env.MODELS_DEFAULT_FOLDER = modelFolder;
      event.dataTransfer.getData.mockReturnValueOnce(JSON.stringify({
        isTemplate: true,
        pluginName: 'pluginName',
        definitionType: 'testTemplate',
      }));

      await wrapper.vm.dropHandler(event);

      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', destinationPath, expect.objectContaining({
        data: expect.objectContaining({ name: 'pluginName' }),
      }));
      expect(appendProjectFileMock).toHaveBeenCalled();
      expect(PluginEvent.RenderEvent.next).toBeCalled();
    });

    it(`should emit a negative notification when an error occured while getting template file 
    after dropping a template component`, async () => {
      Notify.create = jest.fn();

      TemplateManager.getTemplateFileByPath.mockReturnValueOnce(Promise.reject());

      event.dataTransfer.getData.mockReturnValueOnce(JSON.stringify({
        isTemplate: true,
        pluginName: 'pluginName',
        definitionType: 'testTemplate',
      }));

      await wrapper.vm.dropHandler(event);

      expect(Notify.create).toHaveBeenCalledWith({
        message: 'errors.templates.getData',
        html: true,
        type: 'negative',
      });
    });
  });

  describe('Test function: drawComponents', () => {
    it('should call parse() & draw() function', async () => {
      wrapper.vm.data.plugin = {
        parse: jest.fn(),
        draw: jest.fn(),
      };

      await wrapper.vm.drawComponents();

      expect(wrapper.vm.data.plugin.parse).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.data.plugin.draw).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: getDirFiles', () => {
    it('should return an array', async () => {
      const result = await wrapper.vm.getDirFiles('dir');

      expect(result).toEqual([]);
    });
  });

  describe('Test function: onSwitchView', () => {
    it('should redirect to text view when viewType is "text"', async () => {
      wrapper.vm.onSwitchView('text');
      expect(useRouterPush).toHaveBeenCalledWith(expect.objectContaining({
        name: 'modelizer',
        params: {
          viewType: 'text',
          projectName: 'project-00000000',
        },
      }));
    });

    it('should do nothing otherwise', async () => {
      wrapper.vm.onSwitchView('notText');
      expect(useRouterPush).toHaveBeenCalledTimes(0);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to InitEvent', () => {
      expect(initSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to ParseEvent', () => {
      expect(parseSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to DrawEvent', () => {
      expect(drawSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to RenderEvent', () => {
      expect(renderSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to InitEvent', () => {
      expect(initUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(initUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to ParseEvent', () => {
      expect(parseUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(parseUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to DrawEvent', () => {
      expect(drawUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(drawUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to RenderEvent', () => {
      expect(renderUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(renderUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
