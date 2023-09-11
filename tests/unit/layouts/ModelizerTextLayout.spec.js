import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import FileEvent from 'src/composables/events/FileEvent';
import ModelizerTextLayout from 'src/layouts/ModelizerTextLayout.vue';
import { useRouter } from 'vue-router';
import { getPluginByName, getPlugins } from 'src/composables/PluginManager';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      projectName: 'project-00000000',
    },
    query: {
      plugin: 'test',
      path: 'pluginName/modelName/',
    },
  }),
  useRouter: jest.fn(),
}));

jest.mock('src/composables/events/FileEvent', () => ({
  SelectFileTabEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  getAllModels: () => [{
    plugin: 'plugin',
    name: 'name',
  }],
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(() => [{
    isParsable: () => true,
    getModels: ([{ path }]) => [path],
    data: {
      name: 'test',
    },
  }]),
  getPluginByName: jest.fn(),
}));

describe('Test component: ModelizerTextLayout', () => {
  let wrapper;
  let selectFileTabEventSubscribe;
  let selectFileTabEventUnsubscribe;
  let useRouterPush;

  beforeEach(() => {
    selectFileTabEventSubscribe = jest.fn();
    selectFileTabEventUnsubscribe = jest.fn();
    useRouterPush = jest.fn();

    useRouter.mockImplementation(() => ({
      push: useRouterPush,
    }));

    FileEvent.SelectFileTabEvent.subscribe.mockImplementation(() => {
      selectFileTabEventSubscribe();
      return { unsubscribe: selectFileTabEventUnsubscribe };
    });

    wrapper = shallowMount(ModelizerTextLayout, {});
  });

  describe('Test variables initialization', () => {
    describe('Test computed: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });
  });

  describe('Test function: onSelectFileTab', () => {
    it('should only set selectedFileTabPath', async () => {
      await wrapper.vm.onSelectFileTab('pluginName/modelName/fileName');

      expect(useRouterPush).toHaveBeenCalledTimes(0);

      await wrapper.vm.onSelectFileTab(null);

      expect(useRouterPush).toHaveBeenCalledTimes(1);
    });

    it('should also call router.push()', async () => {
      await wrapper.vm.onSelectFileTab('plugin/fileName');

      expect(useRouterPush).toHaveBeenCalledTimes(1);
      expect(useRouterPush).toHaveBeenCalledWith({
        name: 'Text',
        params: {
          projectName: wrapper.vm.projectName,
        },
        query: {
          path: 'plugin/fileName',
          plugin: 'test',
        },
      });

      await wrapper.vm.onSelectFileTab('plugin/name/fileName');

      expect(useRouterPush).toHaveBeenCalledTimes(2);
      expect(useRouterPush).toHaveBeenCalledWith({
        name: 'Text',
        params: {
          projectName: wrapper.vm.projectName,
        },
        query: {
          path: 'plugin/fileName',
          plugin: 'test',
        },
      });
    });

    it('should use query path if there are no models', async () => {
      getPlugins.mockImplementation(() => ([{
        isParsable: () => true,
        getModels: () => ([]),
        data: {
          name: wrapper.vm.query.plugin,
        },
      }]));

      await wrapper.vm.onSelectFileTab('plugin/fileName');

      expect(useRouterPush).toHaveBeenCalledTimes(1);
      expect(useRouterPush).toHaveBeenCalledWith({
        name: 'Text',
        params: {
          projectName: wrapper.vm.projectName,
        },
        query: {
          path: wrapper.vm.query.path,
          plugin: wrapper.vm.query.plugin,
        },
      });
    });

    it('should use query plugin if unparsable file is selected', async () => {
      getPlugins.mockImplementation(() => ([{
        isParsable: () => false,
        getModels: () => ([]),
        data: {
          name: 'test',
        },
      }]));
      getPluginByName.mockImplementation((name) => ({
        isParsable: () => false,
        getModels: () => ([]),
        data: {
          name,
        },
      }));

      await wrapper.vm.onSelectFileTab('plugin/fileName');

      expect(useRouterPush).toHaveBeenCalledTimes(1);
      expect(useRouterPush).toHaveBeenCalledWith({
        name: 'Text',
        params: {
          projectName: wrapper.vm.projectName,
        },
        query: {
          path: wrapper.vm.query.path,
          plugin: wrapper.vm.query.plugin,
        },
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to SelectFileTabEvent', () => {
      expect(selectFileTabEventSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to SelectFileTabEvent', () => {
      expect(selectFileTabEventUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(selectFileTabEventUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
