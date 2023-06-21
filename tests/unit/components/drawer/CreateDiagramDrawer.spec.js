import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import CreateDiagramDrawer from 'src/components/drawer/CreateDiagramDrawer.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import DrawerEvent from 'src/composables/events/DrawerEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  next: jest.fn(),
}));

jest.mock('src/composables/events/DrawerEvent', () => ({
  subscribe: jest.fn(),
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplatesByType: jest.fn(() => [{
    type: 'test1',
    plugin: 'terrator-plugin',
  }, {
    type: 'test2',
    plugin: 'githubator-plugin',
  }]),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(() => [{
    data: {
      name: 'terrator-plugin',
    },
  }, {
    data: {
      name: 'githubator-plugin',
    },
  }]),
}));

describe('Test component: CreateDiagramDrawer', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;
  let next;

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();
    next = jest.fn();

    DrawerEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });
    DialogEvent.next.mockImplementation(() => next());

    wrapper = shallowMount(CreateDiagramDrawer);
  });

  describe('Test function: openImportModelTemplateDialog', () => {
    it('should emit event', () => {
      wrapper.vm.openImportModelTemplateDialog();

      expect(next).toBeCalled();
      expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    });
  });

  describe('Test function: updateTemplates', () => {
    it('should return all templates without filter', () => {
      wrapper.vm.updateTemplates();

      expect(wrapper.vm.templates).toEqual([{
        type: 'test1',
        plugin: 'terrator-plugin',
      }, {
        type: 'test2',
        plugin: 'githubator-plugin',
      }]);
    });

    it('should return only test1 template', () => {
      wrapper.vm.searchTemplateText = 'test1';
      wrapper.vm.selectedPlugin = null;
      wrapper.vm.updateTemplates();

      expect(wrapper.vm.templates).toEqual([{
        type: 'test1',
        plugin: 'terrator-plugin',
      }]);
    });

    it('should return only githubator template', () => {
      wrapper.vm.searchTemplateText = null;
      wrapper.vm.selectedPlugin = 'githubator-plugin';
      wrapper.vm.updateTemplates();

      expect(wrapper.vm.templates).toEqual([{
        type: 'test2',
        plugin: 'githubator-plugin',
      }]);
    });
  });

  describe('Test function: reset', () => {
    it('should clear all inputs', () => {
      wrapper.vm.searchTemplateText = 'test1';
      wrapper.vm.selectedTemplate = 'test1';
      wrapper.vm.selectedPlugin = 'githubator-plugin';

      wrapper.vm.updateTemplates();
      expect(wrapper.vm.templates).toEqual([]);

      wrapper.vm.reset();
      expect(wrapper.vm.searchTemplateText).toBeNull();
      expect(wrapper.vm.selectedTemplate).toBeNull();
      expect(wrapper.vm.selectedPlugin).toBeNull();
      expect(wrapper.vm.templates).toEqual([{
        type: 'test1',
        plugin: 'terrator-plugin',
      }, {
        type: 'test2',
        plugin: 'githubator-plugin',
      }]);
    });
  });

  describe('Test function: toggleTemplate', () => {
    it('should select template key without selected template', () => {
      expect(wrapper.vm.selectedTemplate).toBeNull();

      wrapper.vm.toggleTemplate('test');
      expect(wrapper.vm.selectedTemplate).toEqual('test');
    });

    it('should unselect template key with same selected template', () => {
      expect(wrapper.vm.selectedTemplate).toBeNull();

      wrapper.vm.toggleTemplate('test');
      expect(wrapper.vm.selectedTemplate).toEqual('test');

      wrapper.vm.toggleTemplate('test');
      expect(wrapper.vm.selectedTemplate).toBeNull();
    });

    it('should select template key with another selected template', () => {
      expect(wrapper.vm.selectedTemplate).toBeNull();

      wrapper.vm.toggleTemplate('test1');
      expect(wrapper.vm.selectedTemplate).toEqual('test1');

      wrapper.vm.toggleTemplate('test2');
      expect(wrapper.vm.selectedTemplate).toEqual('test2');
    });
  });

  describe('Test function: onDrawerEvent', () => {
    it('should do nothing on bad key', () => {
      wrapper.vm.onDrawerEvent({ key: 'bad' });

      expect(wrapper.emitted()).toEqual({});
    });

    it('should reset inputs on type "open" and emit an event', () => {
      wrapper.vm.searchTemplateText = 'test1';
      wrapper.vm.selectedTemplate = 'test1';
      wrapper.vm.selectedPlugin = 'githubator-plugin';

      wrapper.vm.updateTemplates();
      expect(wrapper.vm.templates).toEqual([]);

      wrapper.vm.onDrawerEvent({ key: 'CreateDiagram', type: 'open' });

      expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
      expect(wrapper.vm.searchTemplateText).toBeNull();
      expect(wrapper.vm.selectedTemplate).toBeNull();
      expect(wrapper.vm.selectedPlugin).toBeNull();
      expect(wrapper.vm.templates).toEqual([{
        type: 'test1',
        plugin: 'terrator-plugin',
      }, {
        type: 'test2',
        plugin: 'githubator-plugin',
      }]);
    });

    it('should not reset inputs on type "close" and emit an event', () => {
      wrapper.vm.searchTemplateText = 'test1';
      wrapper.vm.selectedTemplate = 'test1';
      wrapper.vm.selectedPlugin = 'githubator-plugin';

      wrapper.vm.updateTemplates();
      expect(wrapper.vm.templates).toEqual([]);

      wrapper.vm.onDrawerEvent({ key: 'CreateDiagram', type: 'close' });

      expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
      expect(wrapper.vm.searchTemplateText).toEqual('test1');
      expect(wrapper.vm.selectedTemplate).toEqual('test1');
      expect(wrapper.vm.selectedPlugin).toEqual('githubator-plugin');
      expect(wrapper.vm.templates).toEqual([]);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe DrawerEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe DrawerEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
