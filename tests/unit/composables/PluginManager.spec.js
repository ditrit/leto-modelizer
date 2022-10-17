/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getDefinitions"] }] */

import * as PluginManager from 'src/composables/PluginManager';

const testPlugin = {
  PluginMetadata: class {
    getDefinitions() {
      return {
        components: [],
        links: [],
      };
    }
  },
  PluginParser: class {},
  PluginRenderer: class {},
  PluginDrawer: class {},
};

jest.mock('src/plugins', () => ({
  testPlugin,
}));
jest.mock('src/composables/Files', () => ({
  readTextFile: () => Promise.resolve('content'),
}));

describe('Test composable: PluginManager', () => {
  describe('Test function: initPluginMetadata', () => {
    it('should add metadata and definitions to plugin', () => {
      const pluginModel = {
        PluginMetadata: class {
          getDefinitions() {
            return {
              components: [{ icon: 'componentIcon' }, {}],
              links: [{ icon: 'linkIcon' }, {}],
            };
          }
        },
      };
      const plugin = { pluginModel };
      PluginManager.initPluginMetadata(plugin);
      expect(plugin.metadata).toBeDefined();
      expect(plugin.definitions).toBeDefined();
    });
  });

  describe('Test function: getFilesInfo', () => {
    it('should return a array of file', () => {
      const plugin = {
        name: 'pluginName',
        definitions: {
          defType: [{
            model: 'model',
          }, {
            icon: 'icon',
          }],
        },
      };
      const defType = 'defType';
      expect(PluginManager.getFilesInfo(plugin, defType)).toEqual([{
        name: 'model',
        type: 'models',
        path: `/plugins/${plugin.name}/models/model.svg`,
      }, {
        name: 'icon',
        type: 'icons',
        path: `/plugins/${plugin.name}/icons/icon.svg`,
      }]);
    });
  });

  describe('Test function: createPluginResources', () => {
    it('should return proper resources', async () => {
      const plugin = {
        name: 'pluginName',
        definitions: {
          links: [],
          components: [{
            model: 'model',
          }, {
            icon: 'icon',
          }],
        },
      };
      const resources = await PluginManager.createPluginResources(plugin);
      expect(resources).toEqual({
        models: {
          model: 'content',
        },
        icons: {
          icon: 'content',
        },
      });
    });
  });

  describe('Test function: initPluginDrawer', () => {
    it('should create and add PluginDrawer to plugin', async () => {
      const pluginModel = {
        PluginDrawer: class {},
      };
      const plugin = {
        pluginModel,
        name: 'pluginName',
        definitions: {
          links: [],
          components: [{
            model: 'model',
          }, {
            icon: 'icon',
          }],
        },
      };

      await PluginManager.initPluginDrawer(plugin);
      expect(plugin.drawer).toBeDefined();
    });
  });

  describe('Test function: initPluginParser', () => {
    it('should create and add PluginParser to plugin', () => {
      const pluginModel = {
        PluginParser: class {},
      };
      const plugin = {
        pluginModel,
        name: 'pluginName',
        definitions: {
          links: [],
          components: [{
            model: 'model',
          }, {
            icon: 'icon',
          }],
        },
      };
      PluginManager.initPluginParser(plugin);
      expect(plugin.parser).toBeDefined();
    });
  });

  describe('Test function: initPluginRenderer', () => {
    it('should create and add PluginRenderer to plugin', () => {
      const pluginModel = {
        PluginRenderer: class {},
      };
      const plugin = {
        pluginModel,
        name: 'pluginName',
        definitions: {
          links: [],
          components: [{
            model: 'model',
          }, {
            icon: 'icon',
          }],
        },
      };
      PluginManager.initPluginRenderer(plugin);
      expect(plugin.renderer).toBeDefined();
    });
  });

  describe('Test function: instantiatePlugin', () => {
    it('should return an instanciated plugin', async () => {
      const plugin = await PluginManager.instantiatePlugin('testPlugin');
      expect(plugin).toEqual({
        pluginModel: testPlugin,
        name: 'testPlugin',
        components: [],
        definitions: {
          components: [],
          links: [],
        },
        drawer: {},
        metadata: {},
        parser: {},
        renderer: {},
      });
    });
  });

  describe('Test function: getPlugins', () => {
    it('should return an empty array', () => {
      expect(PluginManager.getPlugins()).toEqual([]);
    });
  });

  describe('Test function: initPlugins', () => {
    it('should instantiate all plugins', async () => {
      await PluginManager.initPlugins();
      expect(PluginManager.getPlugins()).toEqual([{
        pluginModel: testPlugin,
        name: 'testPlugin',
        components: [],
        definitions: {
          components: [],
          links: [],
        },
        drawer: {},
        metadata: {},
        parser: {},
        renderer: {},
      }]);
    });
  });

  describe('Test function: getPluginByName', () => {
    it('should return the plugin according to the given name', () => {
      PluginManager.getPluginByName('testPlugin');
      expect(PluginManager.getPluginByName('testPlugin')).toEqual({
        pluginModel: testPlugin,
        name: 'testPlugin',
        components: [],
        definitions: {
          components: [],
          links: [],
        },
        drawer: {},
        metadata: {},
        parser: {},
        renderer: {},
      });
    });
  });

  describe('Test function: deleteComponent', () => {
    it('should return false on enpty tree', () => {
      expect(PluginManager.deleteComponent('testID', [])).toBeFalsy();
    });

    it('should return false on enpty tree', () => {
      expect(PluginManager.deleteComponent('testID', [])).toBeFalsy();
    });

    it('should return true and remove a root component', () => {
      const tree = [{ id: 'toRemoveID' }];
      expect(PluginManager.deleteComponent('toRemoveID', tree)).toBeTruthy();
      expect(tree).toEqual([]);
    });

    it('should return true and remove a children component', () => {
      const tree = [{
        id: 'toKeepID',
        children: [{ id: 'toRemoveID' }],
      }];
      expect(PluginManager.deleteComponent('toRemoveID', tree)).toBeTruthy();
      expect(tree).toEqual([{
        id: 'toKeepID',
        children: [],
      }]);
    });
  });
});
