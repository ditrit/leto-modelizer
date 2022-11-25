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
    },
  }, {
    data: {
      getComponentById: () => new Component({ name: 'componentName', definition: new ComponentDefinition() }),
      components: [],
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
  });

  describe('Test function: save', () => {
    it('should update selectedComponent with selectedComponentName & selectedComponentAttributes', () => {
      wrapper.vm.selectedComponentName = 'selectedComponentName';
      wrapper.vm.selectedComponentAttributes = [];

      wrapper.vm.save();

      expect(wrapper.vm.selectedComponent.name).toEqual(wrapper.vm.selectedComponentName);
      expect(wrapper.vm.selectedComponent.attributes)
        .toEqual(wrapper.vm.selectedComponentAttributes);
      expect(wrapper.vm.isVisible).toEqual(false);
    });

    it('should emit RenderEvent event', () => {
      expect(PluginEvent.RenderEvent.next).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: getAttribute', () => {
    it('should return an existing attribute', () => {
      const attribute = { name: 'attribute' };
      const component = {
        attributes: [attribute],
      };
      const definition = { name: 'attribute' };
      expect(wrapper.vm.getAttribute(component, definition)).toEqual(attribute);
    });

    it('should return a new attribute', () => {
      const component = { attributes: [] };
      const definition = { name: 'attribute' };
      expect(wrapper.vm.getAttribute(component, definition)).toEqual({
        name: 'attribute',
        type: null,
        value: null,
        definition,
      });
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

  describe('Test function: getSelectedComponentAttributes', () => {
    const refAttribute = new ComponentAttribute({ name: 'refAttribute', definition: new ComponentAttributeDefinition() });
    const unrefAttribute = new ComponentAttribute({ name: 'unrefAttribute', definition: null });

    beforeEach(() => {
      wrapper.vm.selectedComponentAttributes = [refAttribute, unrefAttribute];
    });

    it('should return referenced attributes', () => {
      expect(wrapper.vm.getSelectedComponentAttributes('referenced')).toEqual([refAttribute]);
    });

    it('should return unreferenced attributes', () => {
      expect(wrapper.vm.getSelectedComponentAttributes('unreferenced')).toEqual([unrefAttribute]);
    });

    it('should return empty array', () => {
      expect(wrapper.vm.getSelectedComponentAttributes('unvalidKey')).toEqual([]);
    });
  });

  describe('Test function: reset', () => {
    it('should reset selectedComponentName & selectedComponentAttributes base on selectedComponent', () => {
      wrapper.vm.selectedComponent = {
        name: 'newName',
        attributes: [],
        definition: new ComponentDefinition(),
      };
      wrapper.vm.selectedComponentName = 'oldName';
      wrapper.vm.selectedComponentAttributes = [{}];

      wrapper.vm.reset();

      expect(wrapper.vm.selectedComponentName).toEqual('newName');
      expect(wrapper.vm.selectedComponentAttributes).toEqual([]);
    });
  });

  describe('Test function: onEdit', () => {
    it('should set isVisible to true and set local values', () => {
      expect(wrapper.vm.isVisible).toBeFalsy();

      wrapper.vm.onEdit({ id: 0 });

      expect(wrapper.vm.isVisible).toBeTruthy();
      expect(wrapper.vm.selectedComponent).toEqual(new Component({
        name: 'componentName',
        attributes: [],
        definition: new ComponentDefinition(),
      }));
      expect(wrapper.vm.selectedComponentName).toEqual('componentName');
      expect(wrapper.vm.selectedComponentAttributes).toEqual([]);
    });
  });

  describe('Test function: deleteAttribute', () => {
    it('should remove selected attribute from selectedComponentAttributes', () => {
      wrapper.vm.selectedComponentAttributes = [{
        name: 'attributeName',
        value: '',
        definition: null,
        type: 'String',
      }];

      wrapper.vm.deleteAttribute('attributeName');

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
