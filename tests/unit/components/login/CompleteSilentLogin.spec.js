import { shallowMount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { Notify } from 'quasar';
import CompleteSilentLogin from 'src/components/login/CompleteSilentLogin';
import UserAuthentication from 'src/composables/UserAuthentication';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/UserAuthentication', () => ({
  completeSilentLogin: jest.fn(),
}));

describe('Test component: CompleteSilentLogin', () => {
  describe('Test hook function: onMounted', () => {
    it('should emit a notification on error', async () => {
      UserAuthentication.completeSilentLogin.mockClear();

      UserAuthentication.completeSilentLogin.mockImplementation(() => {
        Notify.create = jest.fn();

        return Promise.reject();
      });

      const wrapper = shallowMount(CompleteSilentLogin, {
        global: {
          mocks: {
            $t: (key) => key,
          },
        },
      });

      await wrapper.vm.$nextTick();

      expect(UserAuthentication.completeSilentLogin).toHaveBeenCalledTimes(1);
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
