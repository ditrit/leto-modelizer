import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { getPlugins, renderModel } from 'src/composables/PluginManager';
import ComponentDetailPanel from 'src/components/drawer/ComponentDetailPanel.vue';
import {
  Component,
  ComponentAttribute,
  ComponentAttributeDefinition,
  ComponentDefinition,
} from '@ditrit/leto-modelizer-plugin-core';
import { useRoute } from 'vue-router';
import DrawerEvent from 'src/composables/events/DrawerEvent';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/events/DrawerEvent', () => ({
  subscribe: jest.fn(),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(),
  renderPlugin: jest.fn(),
  renderModel: jest.fn(),
}));

describe('test component: Plugin Component Detail Panel', () => {
  let wrapper;
  let drawerEventSubscription;
  let drawerEventUnsubscription;

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
      getComponentById: () => new Component({ id: 'componentId', externalId: 'externalId', definition: new ComponentDefinition() }),
      components: [],
      name: 'test',
    },
  }]);
  renderModel.mockImplementation(() => {});

  beforeEach(() => {
    drawerEventSubscription = jest.fn();
    drawerEventUnsubscription = jest.fn();

    DrawerEvent.subscribe.mockImplementation(() => {
      drawerEventSubscription();
      return { unsubscribe: drawerEventUnsubscription };
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
            renameComponentExternalId: jest.fn(),
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

      wrapper.vm.originalComponent = {
        createAttribute: jest.fn((props) => new ComponentAttribute(props)),
      };

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
    it('should update selectedComponent with selectedComponentExternalId & selectedComponentAttributes', () => {
      wrapper.vm.originalComponent = {};
      wrapper.vm.selectedComponentExternalId = 'selectedComponentExternalId';
      wrapper.vm.selectedComponentAttributes = [];

      wrapper.vm.submit();

      expect(wrapper.vm.originalComponent.attributes)
        .toEqual(wrapper.vm.selectedComponentAttributes);

      wrapper.vm.submit();

      expect(wrapper.vm.originalComponent.attributes)
        .toEqual(wrapper.vm.selectedComponentAttributes);
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
        createAttribute: jest.fn((props) => new ComponentAttribute(props)),
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

  describe('Test function: updateAttributes', () => {
    it('should update attributesUpdated', () => {
      wrapper.vm.originalComponent = { id: 1 };
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
    const component = {
      ...new Component(),
      createAttribute: jest.fn((props) => new ComponentAttribute(props)),
    };

    it('should return attribute with null value when type is not Object', () => {
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

  describe('Test function: getComponentValueType', () => {
    it('should return Array in case of Link', () => {
      expect(wrapper.vm.getComponentValueType(new ComponentAttributeDefinition({ type: 'Link' })))
        .toEqual('Array');
    });

    it('should return String in case of Reference', () => {
      expect(wrapper.vm.getComponentValueType(new ComponentAttributeDefinition({ type: 'Reference' })))
        .toEqual('String');
    });

    it('should return definition type in case of anything else', () => {
      expect(wrapper.vm.getComponentValueType(new ComponentAttributeDefinition({ type: 'Number' })))
        .toEqual('Number');
    });
  });
});
