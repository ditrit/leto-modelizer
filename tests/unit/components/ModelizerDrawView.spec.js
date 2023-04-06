import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerDrawView from 'src/components/ModelizerDrawView.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import PluginManager from 'src/composables/PluginManager';
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
  DefaultEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(),
  deleteComponent: jest.fn(),
  getPluginByName: jest.fn(),
  renderModel: jest.fn(() => [{ path: 'path' }]),
  renderConfiguration: jest.fn(() => [{ path: 'path' }]),
  renderPlugin: jest.fn(() => Promise.resolve([])),
  initComponents: jest.fn(() => Promise.resolve()),
  addNewComponent: jest.fn(),
  addNewTemplateComponent: jest.fn(),
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

describe('Test component: ModelizerDrawView', () => {
  let wrapper;
  let initSubscribe;
  let initUnsubscribe;
  let defaultSubscribe;
  let defaultUnsubscribe;
  let pluginParse;
  let pluginDraw;
  let useRouterPush;
  let testPlugin;

  beforeEach(() => {
    initSubscribe = jest.fn();
    initUnsubscribe = jest.fn();
    defaultSubscribe = jest.fn();
    defaultUnsubscribe = jest.fn();
    pluginParse = jest.fn();
    pluginDraw = jest.fn();
    useRouterPush = jest.fn();

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

    TemplateManager.getTemplateFileByPath.mockImplementation(() => Promise.resolve({ data: 'template file content' }));

    PluginEvent.InitEvent.subscribe.mockImplementation(() => {
      initSubscribe();
      return { unsubscribe: initUnsubscribe };
    });
    PluginEvent.DefaultEvent.subscribe.mockImplementation(() => {
      defaultSubscribe();
      return { unsubscribe: defaultUnsubscribe };
    });

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

    wrapper = shallowMount(ModelizerDrawView, {
      props: {
        projectName: 'project-00000000',
      },
    });
  });

  describe('Test function: onDefaultEvent', () => {
    it('should call PluginManager.renderModel()', async () => {
      expect(PluginManager.renderModel).toHaveBeenCalledTimes(0);

      await wrapper.vm.onDefaultEvent({ event: { type: 'Drawer', action: 'update' } });

      expect(PluginManager.renderModel).toHaveBeenCalledTimes(1);
    });

    it('should call PluginManager.renderConfiguration()', async () => {
      expect(PluginManager.renderConfiguration).toHaveBeenCalledTimes(0);

      await wrapper.vm.onDefaultEvent({ event: { type: 'Drawer', action: 'move' } });

      expect(PluginManager.renderConfiguration).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: initView', () => {
    it('should update data.plugin and update component templates on success', async () => {
      await wrapper.vm.initView();

      expect(wrapper.vm.data.plugin).toEqual(expect.objectContaining({ data: expect.objectContaining({ name: 'pluginName' }) }));
      expect(wrapper.vm.templates).toEqual(expect.arrayContaining([{ plugin: 'plugin', isTemplate: true }]));
    });

    it('should emit a negative notification on error after failing to retrieve templates', async () => {
      TemplateManager.getTemplatesByType.mockReturnValueOnce(Promise.reject());

      Notify.create = jest.fn();

      await wrapper.vm.initView();

      expect(Notify.create).toHaveBeenCalledWith({
        message: 'errors.templates.getData',
        html: true,
        type: 'negative',
      });
    });

    it('should do nothing when there is no plugin', async () => {
      PluginManager.getPluginByName = jest.fn(() => null);
      TemplateManager.getTemplatesByType.mockReturnValueOnce(Promise.reject());

      Notify.create = jest.fn();

      await wrapper.vm.initView();

      expect(Notify.create).not.toHaveBeenCalled();
    });
  });

  describe('Test function: dropHandler', () => {
    it('should call addNewComponent() when isTemplate is false', async () => {
      const event = {
        dataTransfer: {
          getData: () => JSON.stringify({ isTemplate: false }),
        },
      };
      const addNewComponent = jest.fn();

      PluginManager.addNewComponent.mockImplementation(addNewComponent);

      await wrapper.vm.dropHandler(event);

      expect(addNewComponent).toHaveBeenCalledTimes(1);
    });

    it('should call addNewTemplateComponent() when isTemplate is true', async () => {
      const event = {
        dataTransfer: {
          getData: () => JSON.stringify({ isTemplate: true }),
        },
      };
      const addNewTemplateComponent = jest.fn(() => Promise.resolve());

      PluginManager.addNewTemplateComponent.mockImplementation(addNewTemplateComponent);

      await wrapper.vm.dropHandler(event);

      expect(addNewTemplateComponent).toHaveBeenCalledTimes(1);
    });

    it(`should call addNewTemplateComponent() and notify an erreur
      when isTemplate is true but download failed`, async () => {
      const event = {
        dataTransfer: {
          getData: () => JSON.stringify({ isTemplate: true }),
        },
      };
      const addNewTemplateComponent = jest.fn(() => Promise.reject());
      Notify.create = jest.fn();

      PluginManager.addNewTemplateComponent.mockImplementation(addNewTemplateComponent);

      await wrapper.vm.dropHandler(event);

      expect(addNewTemplateComponent).toHaveBeenCalledTimes(1);
      expect(Notify.create).toHaveBeenCalledWith({
        message: 'errors.templates.getData',
        html: true,
        type: 'negative',
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to InitEvent', () => {
      expect(initSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to InitEvent', () => {
      expect(initUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(initUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
