import * as PluginManager from 'src/composables/PluginManager';
import { deleteProjectFile, writeProjectFile } from 'src/composables/Project';

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

    // eslint-disable-next-line class-methods-use-this
    render() {
      return [
        { path: 'path', content: 'content' },
      ];
    }
  },
}));

jest.mock('src/composables/Project', () => ({
  getModelFiles: jest.fn(() => Promise.resolve([{ path: 'path', content: 'content' }])),
  writeProjectFile: jest.fn(() => Promise.resolve()),
  deleteProjectFile: jest.fn(() => Promise.resolve()),
  readProjectFile: jest.fn(() => Promise.resolve({ id: 'TEST' })),
  appendProjectFile: jest.fn(() => Promise.resolve()),
  readDir: jest.fn(() => Promise.resolve([])),
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplateFileByPath: jest.fn(() => Promise.resolve({ data: 'template file content' })),
  getTemplateFiles: jest.fn(() => []),
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

  describe('Test function: renderModel', () => {
    it('should return an array', async () => {
      const plugin = {
        render: () => [],
        isParsable: () => false,
      };
      const array = await PluginManager.renderModel(
        'projectId',
        'modelPath',
        plugin,
      );

      expect(Array.isArray(array)).toBeTruthy();
    });

    it('should call writeProjectFile when render file content is not null', async () => {
      const plugin = {
        render: () => [{
          path: 'test',
          content: 'test',
        }],
        isParsable: () => false,
      };
      const array = await PluginManager.renderModel(
        'projectId',
        'modelPath',
        plugin,
      );

      expect(Array.isArray(array)).toBeTruthy();
      expect(writeProjectFile).toBeCalled();
    });

    it('should call deleteProjectFile when render file content is null', async () => {
      const plugin = {
        render: () => [{
          path: 'test',
          content: null,
        }],
        isParsable: () => false,
      };
      const array = await PluginManager.renderModel(
        'projectId',
        'modelPath',
        plugin,
      );

      expect(Array.isArray(array)).toBeTruthy();
      expect(deleteProjectFile).toBeCalled();
    });
  });

  describe('Test function: renderConfiguration', () => {
    it('should return an array', async () => {
      const plugin = {
        __renderer: {
          renderConfiguration: () => {},
        },
      };
      await PluginManager.renderConfiguration(
        'projectId',
        'modelPath',
        plugin,
      );

      expect(writeProjectFile).toBeCalled();
    });
  });

  describe('Test function: getFileInputs', () => {
    it('should return an array with 1 element', async () => {
      const plugin = {
        isParsable: () => true,
      };
      const result = await PluginManager.getFileInputs(plugin, [{}]);

      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toEqual(1);
    });
  });

  describe('Test function: initComponents', () => {
    it('should call parse', async () => {
      const plugin = {
        parse: jest.fn(),
      };

      expect(plugin.parse).toHaveBeenCalledTimes(0);

      await PluginManager.initComponents('projectName', plugin, 'plugin/model');

      expect(plugin.parse).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: addNewComponent', () => {
    let plugin;

    beforeEach(() => {
      plugin = {
        data: {
          addComponent: jest.fn(),
          getComponentById: jest.fn(),
        },
        isParsable: () => true,
        render: jest.fn(() => []),
      };

      plugin.data.getComponentById.mockReturnValue({ drawOption: null });
    });

    it('should call addComponent and render but not call getComponentById without position', async () => {
      expect(plugin.render).toHaveBeenCalledTimes(0);

      await PluginManager.addNewComponent('projectName', plugin, 'plugin/model', {});

      expect(plugin.data.addComponent).toHaveBeenCalledTimes(1);
      expect(plugin.data.getComponentById).toHaveBeenCalledTimes(0);
      expect(plugin.render).toHaveBeenCalledTimes(1);
    });

    it('should call addComponent, getComponentById and render with position', async () => {
      expect(plugin.render).toHaveBeenCalledTimes(0);

      await PluginManager.addNewComponent(
        'projectName',
        plugin,
        'plugin/model',
        {},
        { x: 0, y: 0 },
      );

      expect(plugin.data.addComponent).toHaveBeenCalledTimes(1);
      expect(plugin.data.getComponentById).toHaveBeenCalledTimes(1);
      expect(plugin.render).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: addNewTemplateComponent', () => {
    it('should call parse', async () => {
      const definition = {
        files: ['app.tf'],
        key: 'template key',
      };
      const plugin = {
        parse: jest.fn(),
      };

      await PluginManager.addNewTemplateComponent('projectName', plugin, 'plugin/model', definition);

      expect(plugin.parse).toHaveBeenCalledTimes(1);
    });
  });
});
