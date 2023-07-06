import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import * as PluginManager from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';
import DiagramsPage from 'src/pages/DiagramsPage';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({
    params: {
      projectName: 'project-00000000',
    },
  })),
}));

jest.mock('src/composables/PluginManager', () => ({
  initComponents: jest.fn(() => Promise.resolve()),
  getPlugins: jest.fn(() => []),
  getPluginByName: jest.fn(() => ({ draw: () => ({}) })),
}));

jest.mock('src/composables/events/PluginEvent', () => ({
  InitEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test page component: DiagramsPage', () => {
  let wrapper;
  let pluginInitSubscribe;
  let pluginInitUnsubscribe;

  beforeEach(() => {
    pluginInitSubscribe = jest.fn();
    pluginInitUnsubscribe = jest.fn();

    PluginEvent.InitEvent.subscribe.mockImplementation(() => {
      pluginInitSubscribe();
      return { unsubscribe: pluginInitUnsubscribe };
    });

    wrapper = shallowMount(DiagramsPage);
  });

  describe('Test variables initialization', () => {
    describe('Test computed: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });
  });

  describe('Test function: zoom', () => {
    it('should update scale value', () => {
      document.getElementById = jest.fn(() => ({ style: {} }));

      expect(wrapper.vm.scale).toEqual(1);

      wrapper.vm.zoom(false);
      expect(wrapper.vm.scale).toEqual(0.5);

      wrapper.vm.zoom(false);
      expect(wrapper.vm.scale).toEqual(0.25);

      wrapper.vm.zoom(true);
      expect(wrapper.vm.scale).toEqual(0.5);

      wrapper.vm.zoom(true);
      expect(wrapper.vm.scale).toEqual(1);

      wrapper.vm.zoom(true);
      expect(wrapper.vm.scale).toEqual(1.5);
    });
  });

  describe('Test function: handlePan', () => {
    it('should update translate value', () => {
      document.getElementById = jest.fn(() => ({ style: {} }));

      expect(wrapper.vm.translate).toEqual({ x: 0, y: 0 });

      wrapper.vm.handlePan({ delta: { x: 1, y: 2 } });
      expect(wrapper.vm.translate).toEqual({ x: 1, y: 2 });
    });
  });

  describe('Test function: drawDiagrams', () => {
    it('should draw all diagrams', async () => {
      const plugins = {
        pluginOne: { name: 'pluginOne', draw: jest.fn() },
        pluginTwo: { name: 'pluginTwo', draw: jest.fn() },
      };
      PluginManager.getPluginByName.mockImplementation((pluginName) => plugins[pluginName]);

      wrapper.vm.diagrams = [
        { name: 'modelOne', plugin: 'pluginOne' },
        { name: 'modelTwo', plugin: 'pluginTwo' },
      ];
      await wrapper.vm.drawDiagrams();

      expect(plugins.pluginOne.draw).toHaveBeenCalled();
      expect(plugins.pluginTwo.draw).toHaveBeenCalled();
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe InitEvent', () => {
      expect(pluginInitSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe InitEvent', () => {
      expect(pluginInitUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pluginInitUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
