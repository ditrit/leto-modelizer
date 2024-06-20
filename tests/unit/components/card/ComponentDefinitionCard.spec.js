import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { useRoute } from 'vue-router';
import ComponentDefinitionCard from 'src/components/card/ComponentDefinitionCard.vue';
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

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: () => ({
    arrangeComponentsPosition: jest.fn(),
    draw: jest.fn(),
    addComponent: jest.fn(),
    data: {
      addComponent: null,
    },
    configuration: {
      defaultFileName: 'test.tf',
    },
  }),
  renderModel: jest.fn(() => Promise.resolve([])),
  addNewTemplateComponent: jest.fn(),
}));

describe('Test component: ComponentDefinitionCard', () => {
  let wrapper;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
    },
    query: {
      path: 'path',
    },
  }));

  beforeEach(() => {
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
        const plugin = {
          draw: jest.fn(() => {}),
          addComponent: jest.fn(() => {}),
          data: {
            addComponent: null,
          },
          configuration: {
            defaultFileName: 'test.tf',
          },
        };

        expect(JSON.stringify(wrapper.vm.plugin)).toEqual(JSON.stringify(plugin));
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
    it('should call plugin.addComponent when isTemplate is false', async () => {
      expect(wrapper.vm.plugin.addComponent).not.toHaveBeenCalled();

      await wrapper.vm.onClickItem();

      expect(wrapper.vm.plugin.addComponent).toHaveBeenCalled();
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

      await wrapper.vm.onClickItem();

      expect(addNewTemplateComponent).toHaveBeenCalledTimes(1);
    });

    it('should call plugin.draw and renderModel', async () => {
      useRoute.mockImplementation(() => ({
        query: {
          path: '',
        },
      }));
      expect(wrapper.vm.plugin.draw).not.toBeCalledWith('root');

      await wrapper.vm.onClickItem();

      expect(wrapper.vm.plugin.arrangeComponentsPosition).toBeCalledWith(null, true);
      expect(wrapper.vm.plugin.draw).toBeCalled();
      expect(PluginManager.renderModel).toBeCalledWith('project-00000000', 'path', wrapper.vm.plugin);
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
  });
});
