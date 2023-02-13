import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { useRoute } from 'vue-router';
import ComponentDefinitionCard from 'src/components/card/ComponentDefinitionCard.vue';
import { renderModel } from 'src/composables/PluginManager';
import TemplateManager from 'src/composables/TemplateManager';
import Project from 'src/composables/Project';
import PluginEvent from 'src/composables/events/PluginEvent';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

const testPlugin = {
  draw: null,
  data: {
    addComponent: null,
  },
};

jest.mock('src/composables/events/PluginEvent', () => ({
  RenderEvent: {
    next: jest.fn(),
  },
}));

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: () => testPlugin,
  renderModel: jest.fn(() => Promise.resolve([])),
}));

jest.mock('src/composables/Project', () => ({
  appendProjectFile: jest.fn(),
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplateFileByPath: jest.fn(),
  generateTemplate: jest.fn((text) => text),
}));

describe('Test component: ComponentDefinitionCard', () => {
  let wrapper;
  let appendProjectFileMock;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
    },
    query: {
      path: 'path',
    },
  }));

  beforeEach(() => {
    appendProjectFileMock = jest.fn();

    Project.appendProjectFile.mockImplementation(() => Promise.resolve(appendProjectFileMock()));
    TemplateManager.getTemplateFileByPath.mockImplementation(() => Promise.resolve({ data: 'template file content' }));

    wrapper = shallowMount(ComponentDefinitionCard, {
      props: {
        definition: {
          type: 'component one',
          isTemplate: false,
          icon: 'icon',
        },
        pluginName: 'plugin',
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: definition', () => {
      it('should match definition.type, definition.isTemplate and definition.icon', () => {
        expect(wrapper.vm.definition).toStrictEqual({
          type: 'component one',
          isTemplate: false,
          icon: 'icon',
        });
      });
    });

    describe('Test prop: pluginName', () => {
      it('should match "plugin"', () => {
        expect(wrapper.vm.pluginName).toEqual('plugin');
      });
    });

    describe('Test computed: componentIcon', () => {
      it('should return string based on pluginName and definition.icon if definition.template is false', () => {
        expect(wrapper.vm.componentIcon).toStrictEqual('img:/plugins/plugin/icons/icon.svg');
      });

      it('should return string based on definition.icon if definition.template is true', async () => {
        await wrapper.setProps({
          definition: {
            type: 'component one',
            isTemplate: true,
            icon: 'templateIcon',
          },
          pluginName: 'plugin',
        });
        expect(wrapper.vm.componentIcon).toStrictEqual('img:templateIcon');
      });
    });
  });

  describe('Test function: onClickItem', () => {
    it('should add component to model'
      + ', call renderModel then emit RenderEvent', async () => {
      process.env.MODELS_DEFAULT_FOLDER = '';
      const definition = { type: 'component one', isTemplate: false, icon: 'icon' };
      const addComponent = jest.fn();
      testPlugin.data.addComponent = addComponent;

      await wrapper.vm.onClickItem();
      expect(addComponent).toHaveBeenLastCalledWith(definition, 'path/');
      expect(renderModel).toHaveBeenCalledTimes(1);
      expect(PluginEvent.RenderEvent.next).toBeCalled();
    });

    it('should add component to model with different path'
      + ', call renderModel then emit RenderEvent', async () => {
      process.env.MODELS_DEFAULT_FOLDER = 'test';
      const definition = { type: 'component one', isTemplate: false, icon: 'icon' };
      const addComponent = jest.fn();
      testPlugin.data.addComponent = addComponent;

      await wrapper.vm.onClickItem();
      expect(addComponent).toHaveBeenLastCalledWith(definition, 'test/path/');
      expect(renderModel).toHaveBeenCalledTimes(2);
      expect(PluginEvent.RenderEvent.next).toBeCalled();
    });

    it('should call appendProjectFile, renderModel then emit RenderEvent', async () => {
      await wrapper.setProps({
        definition: {
          type: 'component one',
          isTemplate: true,
          files: ['app.tf'],
          key: 'template key',
          plugin: 'pluginName',
        },
        pluginName: '',
      });

      await wrapper.vm.onClickItem();
      expect(renderModel).toHaveBeenCalledTimes(3);
      expect(appendProjectFileMock).toHaveBeenCalled();
      expect(PluginEvent.RenderEvent.next).toBeCalled();
    });

    it('should emit a negative notification when an error occured while getting template file'
      + 'after clicking on a template component', async () => {
      Notify.create = jest.fn();

      TemplateManager.getTemplateFileByPath.mockReturnValueOnce(Promise.reject());

      await wrapper.setProps({
        definition: {
          type: 'component one',
          isTemplate: true,
          files: ['app.tf'],
          key: 'template key',
          plugin: 'pluginName',
        },
        pluginName: '',
      });

      await wrapper.vm.onClickItem();
      expect(Notify.create).toHaveBeenCalledWith({
        message: 'errors.templates.getData',
        html: true,
        type: 'negative',
      });
    });
  });
});
