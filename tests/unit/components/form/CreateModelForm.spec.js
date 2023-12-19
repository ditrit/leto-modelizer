import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import CreateModelForm from 'src/components/form/CreateModelForm';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import PluginManager from 'src/composables/PluginManager';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/Project', () => ({
  createProjectFolder: jest.fn(() => Promise.resolve()),
  appendProjectFile: jest.fn(({ path }) => {
    if (path.startsWith('error')) {
      return Promise.reject();
    }
    if (path.startsWith('eexist')) {
      return Promise.reject({ name: 'EEXIST' });
    }
    return Promise.resolve();
  }),
  getAllModels: jest.fn(() => Promise.resolve([])),
  getProjectFolders: jest.fn(() => Promise.resolve([])),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(() => [{
    data: { name: 'pluginName' },
  }]),
  getPluginByName: jest.fn(() => ({
    data: { name: 'pluginName' },
    configuration: {
      defaultFileName: 'file.md',
      restrictiveFolder: 'folder/',
      isFolderTypeDiagram: false,
    },
    isParsable: jest.fn(() => true),
  })),
  getModelPath: jest.fn(() => 'modelPath'),
}));

describe('Test component: CreateModelForm', () => {
  let wrapper;
  let useRouterPush;

  beforeEach(() => {
    useRouterPush = jest.fn();

    useRouter.mockImplementation(() => ({
      push: useRouterPush,
    }));

    wrapper = shallowMount(CreateModelForm, {
      props: {
        projectName: 'projectName',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test computed: modelLocation', () => {
      it('should be "folder/modelPath" when plugin.isFolderTypeDiagram is false', () => {
        wrapper.vm.modelPath = 'modelPath';

        expect(wrapper.vm.modelLocation).toEqual('folder/modelPath');
      });

      it('should be "folder/modelPath/file.md" when plugin.isFolderTypeDiagram is true', () => {
        wrapper.vm.modelPath = 'modelPath';

        PluginManager.getPluginByName.mockImplementation(() => ({
          data: { name: 'pluginName' },
          configuration: {
            defaultFileName: 'file.md',
            restrictiveFolder: 'folder/',
            isFolderTypeDiagram: true,
          },
          isParsable: jest.fn(() => true),
        }));

        expect(wrapper.vm.modelLocation).toEqual('folder/modelPath/file.md');
      });

      it('should be "folder/file.md" when plugin.isFolderTypeDiagram is true and restrictiveFolder is defined', () => {
        PluginManager.getPluginByName.mockImplementation(() => ({
          data: { name: 'pluginName' },
          configuration: {
            defaultFileName: 'file.md',
            restrictiveFolder: 'folder/',
            isFolderTypeDiagram: true,
          },
          isParsable: jest.fn(() => true),
        }));

        expect(wrapper.vm.modelLocation).toEqual('folder/file.md');
      });
    });

    describe('Test computed: fileName', () => {
      it('should be "file.md"', () => {
        expect(wrapper.vm.fileName).toEqual('file.md');
      });

      it('should be empty string when plugin.defaultFileName is null', () => {
        PluginManager.getPluginByName.mockImplementation(() => ({
          data: { name: 'pluginName' },
          configuration: {
            defaultFileName: null,
            restrictiveFolder: null,
            isFolderTypeDiagram: true,
          },
          isParsable: jest.fn(() => true),
        }));

        expect(wrapper.vm.fileName).toEqual('');
      });
    });
  });

  describe('Test props: projectName', () => {
    it('should match "projectName"', () => {
      expect(wrapper.vm.projectName).toEqual('projectName');
    });
  });

  describe('Test funtion: onPluginChange', () => {
    it('should set modelPath to empty string if plugin.isFolderTypeDiagram is true', () => {
      wrapper.vm.modelPath = null;

      wrapper.vm.onPluginChange();

      expect(wrapper.vm.modelPath).toEqual('');
    });

    it('should set modelPath equal to defaultFileName if plugin.isFolderTypeDiagram is false', () => {
      wrapper.vm.modelPath = null;

      PluginManager.getPluginByName.mockImplementation(() => ({
        data: { name: 'pluginName' },
        configuration: {
          defaultFileName: 'file.md',
          restrictiveFolder: '',
          isFolderTypeDiagram: false,
        },
        isParsable: jest.fn(() => true),
      }));

      wrapper.vm.onPluginChange();

      expect(wrapper.vm.modelPath).toEqual('file.md');
    });
  });

  describe('Test funtion: isValidDiagramPath', () => {
    it('should return null if diagram path is parsable and therefore valid', () => {
      const result = wrapper.vm.isValidDiagramPath();

      expect(result).toEqual(null);
    });

    it('should return string error message if diagram path is not parsable and therefore not valid', () => {
      PluginManager.getPluginByName.mockImplementation(() => ({
        data: { name: 'pluginName' },
        configuration: {
          defaultFileName: 'file.md',
          restrictiveFolder: '',
          isFolderTypeDiagram: false,
        },
        isParsable: jest.fn(() => false),
      }));

      const result = wrapper.vm.isValidDiagramPath();

      expect(result).toEqual('errors.models.notParsable');
    });
  });

  describe('Test function: onSubmit', () => {
    it('should emit a positive notification on success and redirect', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
      expect(useRouterPush).toHaveBeenCalledTimes(1);
    });

    it('should emit a negative notification on EEXIST error', async () => {
      await wrapper.setProps({ projectName: 'eexist' });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
        message: 'actions.models.create.notify.eexist',
      }));
    });

    it('should emit a negative notification on error', async () => {
      await wrapper.setProps({ projectName: 'error' });
      Notify.create = jest.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({
        type: 'negative',
        message: 'actions.models.create.notify.error',
      }));
    });
  });
});
