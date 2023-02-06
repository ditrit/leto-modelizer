import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import PluginEvent from 'src/composables/events/PluginEvent';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import { getPlugins } from 'src/composables/PluginManager';
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
  EditEvent: {
    subscribe: jest.fn(),
  },
  DrawEvent: {
    next: jest.fn(),
  },
  RenderEvent: {
    next: jest.fn(),
  },
}));

jest.mock('src/composables/events/ViewSwitchEvent', () => ({
  subscribe: jest.fn(),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(),
  renderPlugin: jest.fn(),
}));

describe('test component: Plugin Component Detail Panel', () => {
  let wrapper;
  let pluginEditSubscription;
  let pluginEditUnsubscription;
  let viewSwitchSubscription;
  let viewSwitchUnsubscription;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
      viewType: 'model',
    },
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

  beforeEach(() => {
    pluginEditSubscription = jest.fn();
    pluginEditUnsubscription = jest.fn();
    viewSwitchSubscription = jest.fn();
    viewSwitchUnsubscription = jest.fn();

    PluginEvent.EditEvent.subscribe.mockImplementation(() => {
      pluginEditSubscription();
      return { unsubscribe: pluginEditUnsubscription };
    });

    ViewSwitchEvent.subscribe.mockImplementation(() => {
      viewSwitchSubscription();
      return { unsubscribe: viewSwitchUnsubscription };
    });

    wrapper = shallowMount(ComponentDetailPanel);
    wrapper.vm.localPlugin = {
      data: {
        name: 'test',
      },
    };
  });

  describe('Test function: save', () => {
    it('should update selectedComponent with selectedComponentId & selectedComponentAttributes', () => {
      wrapper.vm.selectedComponentId = 'selectedComponentId';
      wrapper.vm.selectedComponentAttributes = [];

      wrapper.vm.save();

      expect(wrapper.vm.selectedComponent.id).toEqual(wrapper.vm.selectedComponentId);
      expect(wrapper.vm.selectedComponent.attributes)
        .toEqual(wrapper.vm.selectedComponentAttributes);
      expect(wrapper.vm.isVisible).toEqual(false);
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
      wrapper.vm.selectedComponent = {
        id: 'newId',
        attributes: [],
        definition: new ComponentDefinition(),
      };
      wrapper.vm.selectedComponentId = 'oldId';
      wrapper.vm.selectedComponentAttributes = [{}];

      wrapper.vm.reset();

      expect(wrapper.vm.selectedComponentId).toEqual('newId');
      expect(wrapper.vm.selectedComponentAttributes).toEqual([]);
    });
  });

  describe('Test function: onEdit', () => {
    it('should set isVisible to true and set local values', () => {
      expect(wrapper.vm.isVisible).toBeFalsy();

      wrapper.vm.onEdit({ id: 'id' });

      expect(wrapper.vm.isVisible).toBeTruthy();
      expect(wrapper.vm.selectedComponent).toEqual(new Component({
        id: 'componentId',
        attributes: [],
        definition: new ComponentDefinition(),
      }));
      expect(wrapper.vm.selectedComponentId).toEqual('componentId');
      expect(wrapper.vm.selectedComponentAttributes).toEqual([]);
    });
  });

  describe('Test function: addAttribute', () => {
    it('should add new attribute to selectedComponentAttributes', () => {
      wrapper.vm.selectedComponentAttributes = [];

      wrapper.vm.addAttribute();

      expect(wrapper.vm.selectedComponentAttributes).toEqual([{
        name: 'attribut_1',
        value: '',
        definition: null,
        type: 'String',
      }]);
    });
  });

  describe('Test function: updateAttribute', () => {
    it('should remove attribute when call function with event without attribute', () => {
      wrapper.vm.selectedComponentAttributes = [{
        name: 'attribut_1',
        value: '',
        definition: null,
        type: 'String',
      }];

      wrapper.vm.updateAttribute({ name: 'attribut_1' });

      expect(wrapper.vm.selectedComponentAttributes).toEqual([]);
    });

    it('should update attribute value when call function with event with existing attribute name', () => {
      wrapper.vm.selectedComponentAttributes = [{
        name: 'attribut_1',
        value: '',
        definition: null,
        type: 'String',
      }];

      wrapper.vm.updateAttribute({
        name: 'attribut_1',
        attribute: {
          name: 'attribut_2',
          value: 'test',
          definition: null,
          type: 'String',
        },
      });

      expect(wrapper.vm.selectedComponentAttributes).toEqual([{
        name: 'attribut_2',
        value: 'test',
        definition: null,
        type: 'String',
      }]);
    });

    it('should add attribute value when call function with event with attribute name not existing', () => {
      wrapper.vm.selectedComponentAttributes = [];

      wrapper.vm.updateAttribute({
        name: 'attribut_1',
        attribute: {
          name: 'attribut_1',
          value: 'test',
          definition: null,
          type: 'String',
        },
      });

      expect(wrapper.vm.selectedComponentAttributes).toEqual([{
        name: 'attribut_1',
        value: 'test',
        definition: null,
        type: 'String',
      }]);
    });
  });

  describe('Test function: onViewSwitchUpdate', () => {
    beforeEach(() => {
      wrapper.vm.isVisible = true;
    });

    it('should not set isVisible to false when newViewType is equal to route.params.viewType', () => {
      wrapper.vm.onViewSwitchUpdate('model');

      expect(wrapper.vm.isVisible).toEqual(true);
    });

    it('should set isVisible to false when newViewType is equal to route.params.viewType', () => {
      wrapper.vm.onViewSwitchUpdate('text');

      expect(wrapper.vm.isVisible).toEqual(false);
    });
  });

  describe('Test function: getAttributeByDefinition', () => {
    it('Should return attribute with null value when type is not Object', () => {
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

    it('Should return attribute with array value when type is Object', () => {
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
    it('should subscribe to EditEvent', () => {
      expect(pluginEditSubscription).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to ViewSwitchEvent', () => {
      expect(viewSwitchSubscription).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to EditEvent', () => {
      expect(pluginEditUnsubscription).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pluginEditUnsubscription).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to ViewSwitchEvent', () => {
      expect(viewSwitchUnsubscription).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(viewSwitchUnsubscription).toHaveBeenCalledTimes(1);
    });
  });
});
