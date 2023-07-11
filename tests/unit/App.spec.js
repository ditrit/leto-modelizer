import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import App from 'src/App.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import PluginManager from 'src/composables/PluginManager';
import UserAuthentication from 'src/composables/UserAuthentication';

installQuasarPlugin();

jest.mock('src/composables/UserAuthentication', () => ({
  setUserManager: jest.fn(),
}));

jest.mock('src/composables/PluginManager', () => ({
  initPlugins: () => Promise.resolve(),
  getPlugins: jest.fn(),
}));

jest.mock('src/composables/events/PluginEvent', () => ({
  InitEvent: {
    next: jest.fn(),
  },
}));

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

describe('Test component: App', () => {
  let wrapper;

  beforeEach(() => {
    PluginManager.getPlugins.mockImplementation(() => [
      { data: { deleteAllEventLogsBefore: jest.fn(() => {}) } },
    ]);

    wrapper = shallowMount(App, {
      global: {
        stubs: [
          'router-view',
        ],
      },
    });
  });

  describe('Test function: deleteOldEvents', () => {
    it('should call getPlugins', () => {
      wrapper.vm.deleteOldEvents();

      expect(PluginManager.getPlugins).toHaveBeenCalled();
    });
  });

  describe('Test function: onMounted', () => {
    it('should call PluginEvent.InitEvent', () => {
      expect(PluginEvent.InitEvent.next).toHaveBeenCalled();
    });

    it('should call setInterval', () => {
      expect(setInterval).toHaveBeenCalled();
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 5 * 60 * 1000);
    });

    it('should call setUserManager', () => {
      expect(UserAuthentication.setUserManager).toHaveBeenCalled();
    });
  });
});
