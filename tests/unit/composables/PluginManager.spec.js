import * as PluginManager from 'src/composables/PluginManager';
import { deleteProjectFile, writeProjectFile, setFiles } from 'src/composables/Project';
import { FileInformation, FileInput } from 'leto-modelizer-plugin-core';

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
        parseLogs: [],
      };
      this.configuration = {
        tags: [{
          type: 'category',
          value: 'a',
        }, {
          type: 'category',
          value: 'd',
        }, {
          type: 'category',
          value: 'e',
        }],
        extraResources: [],
      };
      this.parse = jest.fn();
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

    // eslint-disable-next-line class-methods-use-this
    getModels(files) {
      return files;
    }
  },
  test2: class {
    constructor() {
      this.data = {
        name: 'test2',
        definitions: {
          components: [],
          links: [],
        },
        components: [],
        parseLogs: [],
      };
      this.configuration = {
        tags: [{
          type: 'category',
          value: 'a',
        }, {
          type: 'category',
          value: 'd',
        }, {
          type: 'category',
          value: 'e',
        }],
        extraResources: [],
      };
      this.parse = jest.fn();
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
  isDirectory: jest.fn((path) => path === 'modelPath' || path === 'projectId/modelPath'),
  setFiles: jest.fn(),
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
            components: [{
              model: null,
              icon: null,
            }, {
              model: 'model',
              icon: 'icon',
            }],
          },
        },
        configuration: {
          extraResources: [{
            type: 'markers',
            name: 'error',
          }],
        },
      };

      expect(PluginManager.getFilesInfo(plugin)).toEqual([{
        name: 'model',
        type: 'models',
        path: '/plugins/pluginName/models/model.svg',
      }, {
        name: 'icon',
        type: 'icons',
        path: '/plugins/pluginName/icons/icon.svg',
      }, {
        name: 'error',
        type: 'markers',
        path: '/plugins/pluginName/markers/error.svg',
      }, {
        name: 'style',
        type: 'style',
        path: '/plugins/pluginName/style.css',
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
        configuration: {
          extraResources: [{
            type: 'markers',
            name: 'error',
          }, {
            type: 'links',
            name: 'link',
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
        links: {
          link: 'content',
        },
        markers: {
          error: 'content',
        },
        style: 'content',
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

      const plugins = PluginManager.getPlugins();

      expect(plugins.length).toEqual(2);
      expect(plugins[0].data.name).toEqual('test');
      expect(plugins[1].data.name).toEqual('test2');
    });
  });

  describe('Test function: getPluginByName', () => {
    it('should return the plugin according to the given name', () => {
      expect(PluginManager.getPluginByName('test').data.name).toEqual('test');
    });
  });

  describe('Test function: getPluginTags', () => {
    it('should return empty array without good plugin name', () => {
      expect(PluginManager.getPluginTags('bad')).toEqual([]);
    });

    it('should return all tags of the plugin according to the given name', () => {
      expect(PluginManager.getPluginTags('test')).toEqual([{
        type: 'category',
        value: 'a',
      }, {
        type: 'category',
        value: 'd',
      }, {
        type: 'category',
        value: 'e',
      }]);
    });
  });

  describe('Test function: getAllTagsByType', () => {
    it('should return all tags of all plugins', async () => {
      await PluginManager.initPlugins();

      expect(PluginManager.getAllTagsByType('category')).toEqual(['a', 'd', 'e']);
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
    it('should return an array with a file type diagram and delete the file with "null" content', async () => {
      const plugin = {
        render: () => [
          { content: 'file content' },
          { content: null },
        ],
        isParsable: () => true,
        configuration: {
          isFolderTypeDiagram: false,
        },
      };
      const array = await PluginManager.renderModel(
        'projectId',
        'fileTypeDiagramPath',
        plugin,
      );

      expect(array).toEqual([{ content: 'file content' }]);
      expect(writeProjectFile).toBeCalled();
      expect(deleteProjectFile).toBeCalled();
    });

    it('should return an array with a folder type diagram and delete the file with "null" content', async () => {
      const plugin = {
        render: () => [
          { content: 'notParsable' },
          { content: '' },
          { content: 'file content' },
          { content: null },
        ],
        isParsable: jest.fn(({ content }) => content !== 'notParsable'),
        configuration: {
          isFolderTypeDiagram: true,
        },
      };
      const array = await PluginManager.renderModel(
        'projectId',
        'folderTypeDiagramPath',
        plugin,
      );

      expect(array).toEqual([
        { content: '' },
        { content: 'file content' },
        { content: 'notParsable' },
      ]);
      expect(writeProjectFile).toBeCalled();
      expect(deleteProjectFile).toBeCalled();
    });

    it('should return an array with the default file name when diagram type is "Folder" '
      + 'and the only file present has "null" content', async () => {
      const plugin = {
        render: () => [
          { content: null },
        ],
        isParsable: () => true,
        configuration: {
          isFolderTypeDiagram: true,
          defaultFileName: 'defaultFileName',
        },
      };
      const array = await PluginManager.renderModel(
        'projectId',
        'modelPath',
        plugin,
      );

      expect(array).toEqual([new FileInformation({
        path: 'projectId/modelPath/defaultFileName',
        content: '',
      }),
      ]);
      expect(writeProjectFile).toBeCalled();
      expect(deleteProjectFile).toBeCalled();
    });

    it('should return an array with a file when diagram type is "File" '
      + 'and the only file present has "null" content', async () => {
      const plugin = {
        render: () => [
          { content: null },
        ],
        isParsable: () => true,
        configuration: {
          isFolderTypeDiagram: false,
        },
      };
      const array = await PluginManager.renderModel(
        'projectId',
        '',
        plugin,
      );

      expect(array).toEqual([{ content: null }]);
      expect(writeProjectFile).toBeCalled();
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
        isParsable: () => true,
        configuration: {
          isFolderTypeDiagram: false,
        },
        data: {
          parseLogs: [],
        },
      };

      expect(plugin.parse).toHaveBeenCalledTimes(0);

      const logs = await PluginManager.initComponents('projectName', plugin, 'plugin/model');

      expect(plugin.parse).toHaveBeenCalledTimes(1);
      expect(logs).toEqual([]);
    });

    it('should call setFiles if isFolderTypeDiagram is true', async () => {
      const plugin = {
        parse: jest.fn(),
        isParsable: () => true,
        configuration: {
          isFolderTypeDiagram: true,
        },
        data: {
          parseLogs: [],
        },
      };

      expect(setFiles).toHaveBeenCalledTimes(0);

      const logs = await PluginManager.initComponents('projectName', plugin, '');

      expect(setFiles).toHaveBeenCalledTimes(1);
      expect(logs).toEqual([]);
    });
  });

  describe('Test function: analyzeFile', () => {
    it('should return logs', async () => {
      await PluginManager.initPlugins();

      const plugin = PluginManager.getPlugins()[0];
      const input = new FileInput({
        path: 'test1/test2/test3.tf',
        content: 'test',
      });

      expect(PluginManager.analyzeFile(input)).toEqual([]);
      expect(plugin.parse).toBeCalledWith(
        { path: 'test1/test2' },
        { path: 'test1/leto-modelizer.config.json' },
        [{ content: 'test', path: 'test1/test2/test3.tf' }],
      );
    });
  });

  describe('Test function: addNewTemplateComponent', () => {
    it('should call parse when model is created at the root folder', async () => {
      const definition = {
        files: ['app.tf'],
        key: 'template key',
      };
      const plugin = {
        parse: jest.fn(),
      };

      await PluginManager.addNewTemplateComponent('projectName', plugin, '', definition);

      expect(plugin.parse).toHaveBeenCalledTimes(1);
    });

    it('should call parse when model is created inside folder', async () => {
      const definition = {
        files: ['app.tf'],
        key: 'template key',
      };
      const plugin = {
        parse: jest.fn(),
      };

      await PluginManager.addNewTemplateComponent('projectName', plugin, 'folder', definition);

      expect(plugin.parse).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: getModelPath', () => {
    it('should return first file', async () => {
      await PluginManager.initPlugins();

      expect(PluginManager.getModelPath('test', 'test1')).toEqual(new FileInformation({ path: 'test1' }));
    });
  });
});
