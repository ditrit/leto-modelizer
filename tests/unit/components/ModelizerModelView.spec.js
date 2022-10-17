import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerModelView from 'src/components/ModelizerModelView.vue';
import PluginEvent from 'src/composables/events/PluginEvent';

installQuasarPlugin();

jest.mock('src/composables/events/PluginEvent', () => ({
  InitEvent: {
    subscribe: jest.fn(),
  },
  DeleteEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test component: ModelizerModelView', () => {
  let wrapper;
  const initUnsubscribe = jest.fn();
  const deleteUnsubscribe = jest.fn();

  PluginEvent.InitEvent.subscribe.mockImplementation(() => ({ unsubscribe: initUnsubscribe }));
  PluginEvent.DeleteEvent.subscribe.mockImplementation(() => ({ unsubscribe: deleteUnsubscribe }));

  beforeEach(() => {
    wrapper = shallowMount(ModelizerModelView, {
      mocks: {
        PluginEvent,
      },
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

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to InitEvent and DeleteEvent', () => {
      expect(initUnsubscribe).toHaveBeenCalledTimes(0);
      expect(deleteUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(initUnsubscribe).toHaveBeenCalledTimes(1);
      expect(deleteUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
