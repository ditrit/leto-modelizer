import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerModelView from 'src/components/ModelizerModelView.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import Project from 'src/composables/Project';
import PluginManager from 'src/composables/PluginManager';

installQuasarPlugin();

jest.mock('src/composables/events/PluginEvent', () => ({
  InitEvent: {
    subscribe: jest.fn(),
  },
  DeleteEvent: {
    subscribe: jest.fn(),
  },
  ParseEvent: {
    subscribe: jest.fn(),
  },
  DrawEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  getProjectFiles: jest.fn(),
  readProjectFile: jest.fn(),
}));

jest.mock('src/composables/PluginManager', () => ({
  deleteComponent: jest.fn(),
  getPlugins: jest.fn(),
}));

describe('Test component: ModelizerModelView', () => {
  let wrapper;
  let initSubscribe;
  let initUnsubscribe;
  let deleteSubscribe;
  let deleteUnsubscribe;
  let parseSubscribe;
  let parseUnsubscribe;
  let drawSubscribe;
  let drawUnsubscribe;

  beforeEach(() => {
    initSubscribe = jest.fn();
    initUnsubscribe = jest.fn();
    deleteSubscribe = jest.fn();
    deleteUnsubscribe = jest.fn();
    parseSubscribe = jest.fn();
    parseUnsubscribe = jest.fn();
    drawSubscribe = jest.fn();
    drawUnsubscribe = jest.fn();

    PluginEvent.InitEvent.subscribe.mockImplementation(() => {
      initSubscribe();
      return { unsubscribe: initUnsubscribe };
    });
    PluginEvent.DeleteEvent.subscribe.mockImplementation(() => {
      deleteSubscribe();
      return { unsubscribe: deleteUnsubscribe };
    });
    PluginEvent.ParseEvent.subscribe.mockImplementation(() => {
      parseSubscribe();
      return { unsubscribe: parseUnsubscribe };
    });
    PluginEvent.DrawEvent.subscribe.mockImplementation(() => {
      drawSubscribe();
      return { unsubscribe: drawUnsubscribe };
    });

    Project.getProjectFiles.mockImplementation(() => Promise.resolve([{}]));
    Project.readProjectFile.mockImplementation(() => Promise.resolve({ id: 'TEST' }));

    PluginManager.deleteComponent.mockImplementation((componentId, components) => {
      const index = components.findIndex(({ id }) => id === componentId);
      if (index === -1) {
        return false;
      }
      components.splice(index, 1);
      return true;
    });
    PluginManager.getPlugins.mockImplementation(() => []);

    wrapper = shallowMount(ModelizerModelView, {
      props: {
        projectName: 'project-00000000',
      },
      mocks: {
        PluginEvent,
      },
    });
  });

  describe('Test function: getFileInputs', () => {
    it('should return an array with 1 element', async () => {
      const plugin = {
        parser: {
          isParsable: () => true,
        },
      };
      const result = await wrapper.vm.getFileInputs(plugin, [{}]);

      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toEqual(1);
    });
  });

  describe('Test function: drawComponents', () => {
    it('should update plugin.components and call draw() function', async () => {
      const plugin = {
        components: [],
        drawer: {
          draw: jest.fn(),
        },
        parser: {
          isParsable: () => true,
          parse: (fileInputs) => ({ components: fileInputs }),
        },
      };

      await wrapper.vm.drawComponents(plugin);

      expect(plugin.components.length).toEqual(1);
      expect(plugin.drawer.draw).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: deletePluginComponentAndRedraw', () => {
    it('should not call plugin draw function when component is not found', () => {
      const draw = jest.fn();
      wrapper.vm.data.plugins = [{
        components: [{ id: 'toKeepID' }],
        drawer: { draw },
      }];
      expect(draw).toHaveBeenCalledTimes(0);
      wrapper.vm.deletePluginComponentAndRedraw({ id: 'toRemoveID' });
      expect(draw).toHaveBeenCalledTimes(0);
    });

    it('should call plugin draw function when component is found and deleted', () => {
      const draw = jest.fn();
      wrapper.vm.data.plugins = [{
        components: [{ id: 'toRemoveID' }],
        drawer: { draw },
      }];
      expect(draw).toHaveBeenCalledTimes(0);
      wrapper.vm.deletePluginComponentAndRedraw({ id: 'toRemoveID' });
      expect(draw).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to InitEvent', () => {
      expect(initSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to DeleteEvent', () => {
      expect(deleteSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to InitEvent', () => {
      expect(initUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(initUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to DeleteEvent', () => {
      expect(deleteUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(deleteUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
