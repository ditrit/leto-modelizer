import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getPlugins, getComponent } from 'src/composables/PluginManager';
import ComponentDetailPanel from 'src/components/drawer/ComponentDetailPanel.vue';

installQuasarPlugin();

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

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(),
  getComponent: jest.fn(),
}));

describe('test component: Plugin Component Detail Panel', () => {
  let wrapper;
  let pluginEditSubscription;
  let pluginEditUnsubscription;

  getPlugins.mockImplementation(() => [{ components: [] }]);
  getComponent.mockImplementation(() => ({
    name: 'componentName',
    definition: {
      definedAttributes: [],
    },
  }));

  beforeEach(() => {
    pluginEditSubscription = jest.fn();
    pluginEditUnsubscription = jest.fn();

    PluginEvent.EditEvent.subscribe.mockImplementation(() => {
      pluginEditSubscription();
      return { unsubscribe: pluginEditUnsubscription };
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
    });

    it('should emit DrawEvent & RenderEvent events', () => {
      expect(PluginEvent.DrawEvent.next).toHaveBeenCalledTimes(1);
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

  describe('Test function: getAttributes', () => {
    it('should return an existing attribute', () => {
      const definition = { name: 'attribute' };
      const component = {
        attributes: [],
        definition: {
          definedAttributes: [definition],
        },
      };

      expect(wrapper.vm.getAttributes(component)).toEqual([{
        name: 'attribute',
        type: null,
        value: null,
        definition,
      }]);
    });
  });

  describe('Test function: reset', () => {
    it('should reset selectedComponentName & selectedComponentAttributes base on selectedComponent', () => {
      wrapper.vm.selectedComponent = {
        name: 'newName',
        attributes: [],
        definition: {
          definedAttributes: [],
        },
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
      expect(wrapper.vm.selectedComponent).toEqual({
        name: 'componentName',
        definition: {
          definedAttributes: [],
        },
      });
      expect(wrapper.vm.selectedComponentName).toEqual('componentName');
      expect(wrapper.vm.selectedComponentAttributes).toEqual([]);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to EditEvent', () => {
      expect(pluginEditSubscription).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to EditEvent', () => {
      expect(pluginEditUnsubscription).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pluginEditUnsubscription).toHaveBeenCalledTimes(1);
    });
  });
});
