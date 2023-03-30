import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { useRoute } from 'vue-router';
import ComponentDefinitionCard from 'src/components/card/ComponentDefinitionCard.vue';
import TemplateManager from 'src/composables/TemplateManager';
import Project from 'src/composables/Project';
import PluginManager from 'src/composables/PluginManager';
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
  draw: () => {},
  data: {
    addComponent: null,
  },
};

jest.mock('src/composables/PluginManager', () => ({
  getFileInputs: jest.fn(() => []),
  getPluginByName: () => testPlugin,
  renderModel: jest.fn(() => Promise.resolve([])),
  addNewComponent: jest.fn(),
  addNewTemplateComponent: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  appendProjectFile: jest.fn(),
  readDir: jest.fn(() => Promise.resolve([])),
  readProjectFile: jest.fn(() => Promise.resolve({ id: 'TEST' })),
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

    describe('Test prop: plugin', () => {
      it('should return plugin corresponding to pluginName', () => {
        expect(wrapper.vm.plugin).toEqual(testPlugin);
      });
    });

    describe('Test computed: projectName', () => {
      it('should return "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });

    describe('Test computed: query', () => {
      it('should return an object with path "path"', () => {
        expect(wrapper.vm.query).toEqual({
          path: 'path',
        });
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
    it('should call addNewComponent when isTemplate is false', () => {
      const addNewComponent = jest.fn();
      PluginManager.addNewComponent.mockImplementation(addNewComponent);

      wrapper.vm.onClickItem();

      expect(addNewComponent).toHaveBeenCalledTimes(1);
    });

    it('should call addNewTemplateComponent when isTemplate is true', async () => {
      await wrapper.setProps({
        definition: {
          isTemplate: true,
        },
        pluginName: 'pluginName',
      });

      const addNewTemplateComponent = jest.fn(() => Promise.resolve());
      PluginManager.addNewTemplateComponent.mockImplementation(addNewTemplateComponent);

      wrapper.vm.onClickItem();

      expect(addNewTemplateComponent).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: dragStartHandler', () => {
    let event;
    let overlayElement;

    beforeEach(() => {
      overlayElement = {
        style: {},
      };

      document.getElementById = jest.fn(() => overlayElement);

      event = {
        clientX: 100,
        clientY: 100,
        dataTransfer: {
          setData: jest.fn(),
        },
      };
    });

    it('should load a dragged component\'s information', () => {
      wrapper.vm.dragStartHandler(event);

      expect(event.dataTransfer.dropEffect).toEqual('copy');
      expect(event.dataTransfer.setData).toHaveBeenCalledWith('text/plain', JSON.stringify({
        pluginName: 'plugin',
        isTemplate: false,
        definitionType: 'component one',
      }));
    });

    it('should load a dragged template\'s information', async () => {
      await wrapper.setProps({
        definition: {
          type: 'component one',
          isTemplate: true,
          files: ['app.tf'],
          key: 'template key',
          plugin: 'pluginName',
        },
        pluginName: 'pluginName',
      });

      wrapper.vm.dragStartHandler(event);

      expect(event.dataTransfer.dropEffect).toEqual('copy');
      expect(event.dataTransfer.setData).toHaveBeenCalledWith('text/plain', JSON.stringify({
        pluginName: 'pluginName',
        isTemplate: true,
        definitionType: 'template key',
      }));
    });

    it('should cause the overlay to appear', () => {
      wrapper.vm.dragStartHandler(event);

      expect(overlayElement.style.display).toEqual('block');
    });
  });

  describe('Test function: dragEndHandler', () => {
    let overlayElement;

    beforeEach(() => {
      overlayElement = {
        style: {},
      };

      document.getElementById = jest.fn(() => overlayElement);
    });

    it('should hide the overlay', () => {
      wrapper.vm.dragEndHandler();

      expect(overlayElement.style.display).toEqual('none');
    });
  });
});
