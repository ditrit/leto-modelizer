import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import SplashPage from 'src/pages/SplashPage.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import PluginManager from 'src/composables/PluginManager';

installQuasarPlugin();

jest.mock('src/composables/PluginManager', () => ({
  initPlugins: () => Promise.resolve(),
  getPlugins: jest.fn(),
}));

jest.mock('src/composables/events/PluginEvent', () => ({
  InitEvent: {
    next: jest.fn(),
  },
}));

jest.mock('vue-router', () => ({
  useRoute: () => ({
    query: {
      from: 'test',
    },
  }),
  useRouter: () => ({
    push: () => {},
    path: 'test',
  }),
}));

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('Test component: SplashPage', () => {
  let wrapper;

  beforeEach(() => {
    PluginManager.getPlugins.mockImplementation(() => [
      { data: { deleteAllEventLogsBefore: jest.fn(() => {}) } },
    ]);

    wrapper = shallowMount(SplashPage, {
      global: {
        stubs: {
          qIcon: true,
        },
      },
    });
  });

  describe('Test function: onMounted', () => {
    it('should call PluginEvent.InitEvent', async () => {
      jest.advanceTimersByTime(5000);
      await wrapper.vm.$nextTick();
      expect(wrapper.exists()).toBe(true);
      expect(PluginEvent.InitEvent.next).toHaveBeenCalled();
    });

    it('should call setTimeout', async () => {
      await wrapper.vm.$nextTick();
      expect(setTimeout).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000);
    });
  });
});
