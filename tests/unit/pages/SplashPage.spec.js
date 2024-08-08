import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import SplashPage from 'src/pages/SplashPage.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import PluginManager from 'src/composables/PluginManager';
import { initUserInformation, initUserPermissions } from 'src/services/UserService';
import { setActivePinia, createPinia } from 'pinia';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

installQuasarPlugin();

jest.mock('vue-i18n', () => ({
  useI18n: jest.fn(() => ({
    t: (t) => t,
    mergeLocaleMessage: jest.fn(),
    availableLocales: ['en-US'],
  })),
}));

jest.mock('src/composables/PluginManager', () => ({
  initPlugins: () => Promise.resolve(),
  getPlugins: jest.fn(() => [{
    data: {
      name: 'test',
    },
    configuration: {
      i18n: {
        'en-US': {
          test: 'test',
        },
      },
    },
  }]),
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
    fullPath: 'test',
  }),
  useRouter: () => ({
    push: () => {},
    path: 'test',
    replace: () => {},
  }),
}));

jest.mock('src/services/UserService', () => ({
  initUserInformation: jest.fn(),
  initUserPermissions: jest.fn(),
}));

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('Test component: SplashPage', () => {
  let wrapper;

  beforeEach(() => {
    PluginManager.getPlugins.mockImplementation(() => [
      {
        data: {
          deleteAllEventLogsBefore: jest.fn(() => {}),
          name: 'plugin-test',
        },
        configuration: {
          i18n: {
            'en-US': {
              test: 'test',
            },
          },
        },
      },
    ]);

    setActivePinia(createPinia());

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

  describe('Test function: initPluginsI18n', () => {
    it('should update translations', () => {
      const mergeLocaleMessage = jest.fn();

      useI18n.mockImplementation(() => ({
        t: (t) => t,
        mergeLocaleMessage,
        availableLocales: ['en-US'],
      }));

      wrapper = shallowMount(SplashPage, {
        global: {
          stubs: {
            qIcon: true,
          },
        },
      });

      wrapper.vm.initPluginsI18n();

      expect(mergeLocaleMessage).toBeCalledWith('en-US', { 'plugin-test': { test: 'test' } });
    });
  });

  describe('Test function: initUser', () => {
    beforeEach(() => {
      initUserInformation.mockClear();
      initUserPermissions.mockClear();

      process.env.HAS_BACKEND = true;
    });

    it('should call backend when it is activated', async () => {
      initUserInformation.mockImplementation(() => Promise.resolve({}));
      initUserPermissions.mockImplementation(() => Promise.resolve({}));
      await wrapper.vm.initUser();

      expect(initUserInformation).toHaveBeenCalledTimes(1);
      expect(initUserPermissions).toHaveBeenCalledTimes(1);
    });

    it('should call backend when it is activated but initUserInformation failed', async () => {
      initUserInformation.mockImplementation(() => Promise.reject({}));
      Notify.create = jest.fn();

      await wrapper.vm.initUser();

      expect(initUserInformation).toHaveBeenCalledTimes(1);
      expect(initUserPermissions).toHaveBeenCalledTimes(1);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should call backend when it is activated but initUserPermissions failed', async () => {
      initUserPermissions.mockImplementation(() => Promise.reject({}));
      Notify.create = jest.fn();

      await wrapper.vm.initUser();

      expect(initUserInformation).toHaveBeenCalledTimes(1);
      expect(initUserPermissions).toHaveBeenCalledTimes(1);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should not call backend when it is not activated', async () => {
      // env variables are automatically converted to strings when set in unit tests.
      // So use `delete` to mock `process.env.HAS_BACKEND = false`.
      delete process.env.HAS_BACKEND;
      Notify.create = jest.fn();

      await wrapper.vm.initUser();

      expect(initUserInformation).toHaveBeenCalledTimes(0);
      expect(initUserPermissions).toHaveBeenCalledTimes(0);
    });
  });
});
