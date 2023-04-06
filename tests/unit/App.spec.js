import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import App from 'src/App.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import PluginManager from 'src/composables/PluginManager';

installQuasarPlugin();

jest.mock('src/composables/PluginManager', () => ({
  initPlugins: () => Promise.resolve(),
  getPlugins: () => jest.fn(() => [{ data: { deleteAllEventLogsBefore: () => {} } }]),
}));

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

jest.mock('src/composables/events/PluginEvent', () => ({
  InitEvent: {
    next: jest.fn(),
  },
}));

describe('Test component: App', () => {
  beforeEach(() => {
    shallowMount(App, {
      global: {
        stubs: [
          'router-view',
        ],
      },
    });
  });

  describe('Test function: onMounted', () => {
    it('should call PluginEvent.InitEvent', () => {
      expect(PluginEvent.InitEvent.next).toHaveBeenCalled();
    });

    it('should call setInterval', () => {
      PluginManager.getPlugins();

      expect(setInterval).toHaveBeenCalled();
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 5 * 60 * 1000);
    });
  });
});
