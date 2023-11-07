import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import SplashPage from 'src/pages/SplashPage.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import PluginManager from 'src/composables/PluginManager';
import { getUserSessionToken, login, initUserInformation } from 'src/composables/UserAuthentication';
import { setActivePinia, createPinia } from 'pinia';
import { Notify } from 'quasar';

installQuasarPlugin();

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
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

jest.mock('src/composables/UserAuthentication', () => ({
  login: jest.fn(),
  getUserSessionToken: jest.fn(),
  initUserInformation: jest.fn(),
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

  describe('Test function: initUser', () => {
    beforeEach(() => {
      login.mockClear();
      getUserSessionToken.mockClear();
      initUserInformation.mockClear();
      process.env.HAS_BACKEND = true;
    });

    it('should call backend when it is activated and session token is not in storage', async () => {
      getUserSessionToken.mockImplementation(() => false);
      login.mockImplementation(() => Promise.resolve({}));
      Notify.create = jest.fn();

      await wrapper.vm.initUser();

      expect(getUserSessionToken).toHaveBeenCalledTimes(1);
      expect(login).toHaveBeenCalledTimes(1);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should call backend when it is activated but login failed', async () => {
      getUserSessionToken.mockImplementation(() => false);
      login.mockImplementation(() => Promise.reject({}));
      Notify.create = jest.fn();

      await wrapper.vm.initUser();

      expect(getUserSessionToken).toHaveBeenCalledTimes(1);
      expect(login).toHaveBeenCalledTimes(1);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should call backend when it is activated and session token is already in storage', async () => {
      getUserSessionToken.mockImplementation(() => true);
      initUserInformation.mockImplementation(() => Promise.resolve({}));
      setActivePinia(createPinia());

      await wrapper.vm.initUser();

      expect(getUserSessionToken).toHaveBeenCalledTimes(3);
      expect(initUserInformation).toHaveBeenCalledTimes(1);
    });

    it('should call backend when it is activated and session token is already in storage but initUserInformation fails', async () => {
      getUserSessionToken.mockImplementation(() => true);
      initUserInformation.mockImplementation(() => Promise.reject({}));
      setActivePinia(createPinia());
      Notify.create = jest.fn();

      await wrapper.vm.initUser();

      expect(getUserSessionToken).toHaveBeenCalledTimes(3);
      expect(initUserInformation).toHaveBeenCalledTimes(1);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should call not backend when it is not activated and session token is already in storage but initUserInformation fails', async () => {
      // env variables are automatically converted to strings when set in unit tests.
      // So use `delete` to mock `process.env.HAS_BACKEND = false`.
      delete process.env.HAS_BACKEND;
      Notify.create = jest.fn();

      await wrapper.vm.initUser();

      expect(getUserSessionToken).toHaveBeenCalledTimes(0);
      expect(initUserInformation).toHaveBeenCalledTimes(0);
      expect(Notify.create).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
