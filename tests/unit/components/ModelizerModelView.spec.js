import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerModelView from 'src/components/ModelizerModelView.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
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
  RenderEvent: {
    subscribe: jest.fn(),
  },
  DrawEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/PluginManager', () => ({
  deleteComponent: jest.fn(),
  getPlugins: jest.fn(),
  drawComponents: jest.fn(),
}));

describe('Test component: ModelizerModelView', () => {
  let wrapper;
  let initSubscribe;
  let initUnsubscribe;
  let deleteSubscribe;
  let deleteUnsubscribe;
  let parseSubscribe;
  let parseUnsubscribe;
  let renderSubscribe;
  let renderUnsubscribe;
  let drawSubscribe;
  let drawUnsubscribe;

  beforeEach(() => {
    initSubscribe = jest.fn();
    initUnsubscribe = jest.fn();
    deleteSubscribe = jest.fn();
    deleteUnsubscribe = jest.fn();
    parseSubscribe = jest.fn();
    parseUnsubscribe = jest.fn();
    renderSubscribe = jest.fn();
    renderUnsubscribe = jest.fn();
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
    PluginEvent.RenderEvent.subscribe.mockImplementation(() => {
      renderSubscribe();
      return { unsubscribe: renderUnsubscribe };
    });
    PluginEvent.DrawEvent.subscribe.mockImplementation(() => {
      drawSubscribe();
      return { unsubscribe: drawUnsubscribe };
    });

    PluginManager.deleteComponent.mockImplementation((componentId, components) => {
      const index = components.findIndex(({ id }) => id === componentId);
      if (index === -1) {
        return false;
      }
      components.splice(index, 1);
      return true;
    });
    PluginManager.getPlugins.mockImplementation(() => [{ data: { name: 'pluginName' } }]);
    PluginManager.drawComponents.mockImplementation(() => 'draw');

    wrapper = shallowMount(ModelizerModelView, {
      props: {
        projectName: 'project-00000000',
      },
      mocks: {
        PluginEvent,
      },
    });
  });

  describe('Test functions', () => {
    describe('Test function: updatePlugins', () => {
      it('should update data.plugins and call drawComponents', () => {
        wrapper.vm.updatePlugins();

        expect(wrapper.vm.data.plugins).toEqual([{ data: { name: 'pluginName' } }]);
        expect(PluginManager.drawComponents).toBeCalled();
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to InitEvent', () => {
      expect(initSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to InitEvent', () => {
      expect(initUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(initUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
