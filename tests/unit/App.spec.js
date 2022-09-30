import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import App from 'src/App.vue';
import PluginEvent from 'src/composables/events/PluginEvent';

installQuasarPlugin();

jest.mock('src/composables/PluginManager', () => ({
  initPlugins: () => Promise.resolve(),
}));
jest.mock('src/composables/events/PluginEvent', () => ({
  next: jest.fn(),
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
    it('Should call PluginManger.initPlugins', () => {
      expect(PluginEvent.next).toHaveBeenCalled();
    });
  });
});
