import * as PluginManager from 'src/composables/PluginManager';

jest.mock('src/plugins', () => ({
  test: class {
    constructor() {
      this.data = {
        name: 'test',
        definitions: {
          components: [],
          links: [],
        },
        components: [],
      };
    }

    // eslint-disable-next-line class-methods-use-this
    init() {}

    // eslint-disable-next-line class-methods-use-this
    initResources() {}

    // eslint-disable-next-line class-methods-use-this
    isParsable(file) {
      return file !== 'notParsable';
    }
  },
}));

jest.mock('src/composables/Files', () => ({
  readTextFile: () => Promise.resolve('content'),
}));

describe('Test composable: PluginManager', () => {
  describe('Test function: getFilesInfo', () => {
    it('should return a array of file', () => {
      const plugin = {
        data: {
          name: 'pluginName',
          definitions: {
            defType: [{
              model: 'model',
            }, {
              icon: 'icon',
            }],
          },
        },
      };
      const defType = 'defType';
      expect(PluginManager.getFilesInfo(plugin, defType)).toEqual([{
        name: 'model',
        type: 'models',
        path: '/plugins/pluginName/models/model.svg',
      }, {
        name: 'icon',
        type: 'icons',
        path: '/plugins/pluginName/icons/icon.svg',
      }]);
    });
  });

  describe('Test function: createPluginResources', () => {
    it('should return proper resources', async () => {
      const plugin = {
        data: {
          name: 'pluginName',
          definitions: {
            links: [],
            components: [{
              model: 'model',
            }, {
              icon: 'icon',
            }],
          },
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

  describe('Test function: instantiatePlugin', () => {
    it('should return an instanciated plugin', async () => {
      const plugin = await PluginManager.instantiatePlugin('test');
      expect(plugin).not.toBeNull();
      expect(plugin.data.name).toEqual('test');
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
        data: {
          name: 'test',
          definitions: {
            links: [],
            components: [],
          },
          components: [],
        },
      }]);
    });
  });

  describe('Test function: getPluginByName', () => {
    it('should return the plugin according to the given name', () => {
      expect(PluginManager.getPluginByName('test')).toEqual({
        data: {
          name: 'test',
          definitions: {
            links: [],
            components: [],
          },
          components: [],
        },
      });
    });
  });

  describe('Test function: isParsableFile', () => {
    it('should return false is file is not parsable', () => {
      expect(PluginManager.isParsableFile('notParsable')).toEqual(false);
    });

    it('should return true if file is parsable', () => {
      expect(PluginManager.isParsableFile('parsable')).toEqual(true);
    });
  });
});
