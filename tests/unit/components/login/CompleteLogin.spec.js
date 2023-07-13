import { shallowMount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { Notify } from 'quasar';
import CompleteLogin from 'src/components/login/CompleteLogin';
import UserAuthentication from 'src/composables/UserAuthentication';
import { useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('vue-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('src/composables/UserAuthentication', () => ({
  completeLogin: jest.fn(),
}));

describe('Test component: CompleteLogin', () => {
  let mockPush;
  let mockNotify;

  beforeEach(() => {
    mockPush = jest.fn();
    mockNotify = jest.fn();

    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });

  describe('Test hook function: onMounted', () => {
    it('should call router.push and send positive notification', async () => {
      UserAuthentication.completeLogin.mockClear();

      UserAuthentication.completeLogin.mockImplementation(() => {
        Notify.create = mockNotify;

        return Promise.resolve();
      });

      const wrapper = shallowMount(CompleteLogin, {
        global: {
          mocks: {
            $t: (key) => key,
          },
        },
      });

      await wrapper.vm.$nextTick();

      expect(UserAuthentication.completeLogin).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should emit a notification on error', async () => {
      UserAuthentication.completeLogin.mockClear();

      UserAuthentication.completeLogin.mockImplementation(() => {
        Notify.create = mockNotify;

        return Promise.reject();
      });

      const wrapper = shallowMount(CompleteLogin, {
        global: {
          mocks: {
            $t: (key) => key,
          },
        },
      });

      await wrapper.vm.$nextTick();
      expect(UserAuthentication.completeLogin).toHaveBeenCalledTimes(1);

      // Need to wait again for the Notify.create to be called inside catch.
      await wrapper.vm.$nextTick();
      expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
