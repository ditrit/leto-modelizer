import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import * as PluginManager from 'src/composables/PluginManager';
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

describe('Test page component: DiagramsPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DiagramsPage);
  });

  describe('Test variables initialization', () => {
    describe('Test computed: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
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
});
