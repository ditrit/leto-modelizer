import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getPlugins, renderModel } from 'src/composables/PluginManager';
import ComponentDetailPanel from 'src/components/drawer/ComponentDetailPanel.vue';
import {
  Component,
  ComponentAttribute,
  ComponentAttributeDefinition,
  ComponentDefinition,
} from 'leto-modelizer-plugin-core';
import { useRoute } from 'vue-router';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/events/PluginEvent', () => ({
  DefaultEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(),
  renderPlugin: jest.fn(),
  renderModel: jest.fn(),
}));

describe('test component: Plugin Component Detail Panel', () => {
  let wrapper;
  let pluginDefaultSubscription;
  let pluginDefaultUnsubscription;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
      viewType: 'model',
    },
    query: { path: 'coucou' },
  }));

  getPlugins.mockImplementation(() => [{
    data: {
      getComponentById: () => null,
      components: [],
      name: 'test',
    },
  }, {
    data: {
      getComponentById: () => new Component({ id: 'componentId', definition: new ComponentDefinition() }),
      components: [],
      name: 'test',
    },
  }]);
  renderModel.mockImplementation(() => {});

  beforeEach(() => {
    pluginDefaultSubscription = jest.fn();
    pluginDefaultUnsubscription = jest.fn();

    PluginEvent.DefaultEvent.subscribe.mockImplementation(() => {
      pluginDefaultSubscription();
      return { unsubscribe: pluginDefaultUnsubscription };
    });

    wrapper = shallowMount(ComponentDetailPanel, {
      props: {
        plugin: {
          data: {
            name: 'pluginName',
            definitions: {
              components: [{
                type: 'componentType',
              }],
            },
          },
          draw: jest.fn(),
        },
      },
    });
    wrapper.vm.localPlugin = {
      data: {
        name: 'test',
      },
    };
  });

  describe('Test function: sanitizeAttributes', () => {
    it('should return sanitized array', () => {
      const attributes = [{
        name: 'attribute_no_value',
      }, {
        name: 'attribute_empty_value',
      }, {
        name: 'attribute',
        value: 'value',
      }, {
        name: 'attribute_false',
        type: 'Boolean',
        value: false,
      }, {
        name: 'object_empty',
        type: 'Object',
        value: [],
      }, {
        name: 'object',
        type: 'Object',
        value: [{
          name: 'attribute_in_object',
          value: 'value',
        }],
      }];

      expect(wrapper.vm.sanitizeAttributes(attributes)).toEqual([new ComponentAttribute({
        name: 'attribute',
        value: 'value',
      }), new ComponentAttribute({
        name: 'attribute_false',
        type: 'Boolean',
        value: false,
      }), new ComponentAttribute({
        name: 'object',
        type: 'Object',
        value: [new ComponentAttribute({
          name: 'attribute_in_object',
          value: 'value',
        })],
      })]);
    });
  });

  describe('Test function: submit', () => {
    it('should update selectedComponent with selectedComponentId & selectedComponentAttributes', () => {
      wrapper.vm.originalComponent = {};
      wrapper.vm.selectedComponentId = 'selectedComponentId';
      wrapper.vm.selectedComponentAttributes = [];

      wrapper.vm.submit();

      expect(wrapper.vm.originalComponent.id).toEqual(wrapper.vm.selectedComponentId);
      expect(wrapper.vm.originalComponent.attributes)
        .toEqual(wrapper.vm.selectedComponentAttributes);
      expect(wrapper.vm.isVisible).toEqual(false);

      wrapper.vm.submit();

      expect(wrapper.vm.originalComponent.id).toEqual(wrapper.vm.selectedComponentId);
      expect(wrapper.vm.originalComponent.attributes)
        .toEqual(wrapper.vm.selectedComponentAttributes);
      expect(wrapper.vm.isVisible).toEqual(false);
      expect(wrapper.vm.forceSave).toEqual(false);
    });
  });

  describe('Test function: save', () => {
    it('should set isVisible to false if form validation is successful', async () => {
      wrapper.vm.originalComponent = {};
      wrapper.vm.form = {
        validate: jest.fn(() => Promise.resolve(true)),
      };
      wrapper.vm.isVisible = true;

      await wrapper.vm.save();

      expect(wrapper.vm.isVisible).toEqual(false);
    });

    it(`should set isVisible to false
      if form validation is not successful but forceSave is true`, async () => {
      wrapper.vm.originalComponent = {};
      wrapper.vm.form = {
        validate: jest.fn(() => Promise.resolve(false)),
      };
      wrapper.vm.isVisible = true;
      wrapper.vm.forceSave = true;

      await wrapper.vm.save();

      expect(wrapper.vm.isVisible).toEqual(false);
      expect(wrapper.vm.forceSave).toEqual(false);
    });

    it(`should not set isVisible to false
      if form validation is not successful and forceSave is false`, async () => {
      wrapper.vm.form = {
        validate: jest.fn(() => Promise.resolve(false)),
      };
      wrapper.vm.isVisible = true;

      await wrapper.vm.save();

      expect(wrapper.vm.isVisible).toEqual(true);
    });
  });

  describe('Test function: getReferencedAttributes', () => {
    it('should return an existing attribute', () => {
      const definition = { name: 'attribute' };
      const component = {
        attributes: [],
        definition: {
          definedAttributes: [definition],
        },
      };

      expect(wrapper.vm.getReferencedAttributes(component)).toEqual([{
        name: 'attribute',
        type: null,
        value: null,
        definition,
      }]);
    });
  });

  describe('Test function: getUnreferencedAttributes', () => {
    it('should return an existing attribute without definition', () => {
      const attributes = new ComponentAttribute({ name: 'attribute', definition: null });
      const component = {
        attributes: [attributes],
      };

      expect(wrapper.vm.getUnreferencedAttributes(component)).toEqual([{
        name: 'attribute',
        definition: null,
        type: null,
        value: null,
      }]);
    });
  });

  describe('Test function: reset', () => {
    it('should reset selectedComponentId & selectedComponentAttributes base on selectedComponent', () => {
      wrapper.vm.originalComponent = {
        id: 'newId',
        attributes: [],
        definition: new ComponentDefinition(),
      };
      wrapper.vm.selectedComponentId = 'oldId';
      wrapper.vm.selectedComponentAttributes = [{}];
      wrapper.vm.forceSave = true;

      wrapper.vm.reset();

      expect(wrapper.vm.selectedComponentId).toEqual('newId');
      expect(wrapper.vm.selectedComponentAttributes).toEqual([]);
      expect(wrapper.vm.forceSave).toEqual(false);
    });
  });

  describe('Test function: setLocalValues', () => {
    it('should set isVisible to true and set local values', () => {
      expect(wrapper.vm.isVisible).toBeFalsy();

      const component = new Component({
        id: 'componentId',
        attributes: [],
        definition: new ComponentDefinition(),
      });

      wrapper.vm.props.plugin.data.getComponentById = () => component;
      wrapper.vm.setLocalValues({ event: { action: 'select', type: 'Drawer', components: ['id'] } });

      expect(wrapper.vm.isVisible).toBeTruthy();
      expect(wrapper.vm.originalComponent).toEqual(component);
      expect(wrapper.vm.selectedComponentId).toEqual('componentId');
      expect(wrapper.vm.selectedComponentAttributes).toEqual([]);
    });

    it('should not set local values if event.components is not defined', () => {
      expect(wrapper.vm.isVisible).toBeFalsy();

      wrapper.vm.setLocalValues({ event: { } });

      expect(wrapper.vm.isVisible).toBeFalsy();
      expect(wrapper.vm.originalComponent).toEqual(null);
      expect(wrapper.vm.selectedComponentId).toEqual('');
      expect(wrapper.vm.selectedComponentAttributes).toEqual([]);
    });

    it('should not set local values if event.components array is empty', () => {
      expect(wrapper.vm.isVisible).toBeFalsy();

      wrapper.vm.setLocalValues({ event: { components: [] } });

      expect(wrapper.vm.isVisible).toBeFalsy();
      expect(wrapper.vm.originalComponent).toEqual(null);
      expect(wrapper.vm.selectedComponentId).toEqual('');
      expect(wrapper.vm.selectedComponentAttributes).toEqual([]);
    });
  });

  describe('Test function: updateAttributes', () => {
    it('should update attributesUpdated', () => {
      wrapper.vm.updateAttributes({
        attributes: [{ name: 'attribut_1' }],
      });

      expect(wrapper.vm.attributesUpdated).toEqual([{ name: 'attribut_1' }]);
    });
  });

  describe('Test function: onError', () => {
    it('should set currentError with value of full-name attribute', () => {
      wrapper.vm.onError({
        nativeEl: {
          getAttribute: (name) => {
            if (name === 'full-name') {
              return 'test';
            }

            return 'bad';
          },
        },
      });

      expect(wrapper.vm.currentError).toEqual('test');
    });

    it('should not set currentError when onError param is falsy', () => {
      wrapper.vm.onError(false);

      expect(wrapper.vm.currentError).toBeNull();
    });
  });

  describe('Test function: clearError', () => {
    it('should clear currentError', () => {
      wrapper.vm.currentError = 'test';
      expect(wrapper.vm.currentError).toEqual('test');

      wrapper.vm.clearError();
      expect(wrapper.vm.currentError).toBeNull();
    });
  });

  describe('Test function: getAttributeByDefinition', () => {
    it('should return attribute with null value when type is not Object', () => {
      const component = new Component();
      const definition = new ComponentAttributeDefinition({
        name: 'test',
        type: 'String',
      });
      expect(wrapper.vm.getAttributeByDefinition(component, definition)).toEqual(
        new ComponentAttribute({
          name: 'test',
          type: 'String',
          value: null,
          definition,
        }),
      );
    });

    it('should return attribute with array value when type is Object', () => {
      const component = new Component();
      const definition = new ComponentAttributeDefinition({
        name: 'test',
        type: 'Object',
      });
      expect(wrapper.vm.getAttributeByDefinition(component, definition)).toEqual(
        new ComponentAttribute({
          name: 'test',
          type: 'Object',
          value: [],
          definition,
        }),
      );
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to DefaultEvent', () => {
      expect(pluginDefaultSubscription).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to DefaultEvent', () => {
      expect(pluginDefaultUnsubscription).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pluginDefaultUnsubscription).toHaveBeenCalledTimes(1);
    });
  });
});
