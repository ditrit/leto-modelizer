import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import LoginPage from 'src/pages/LoginPage.vue';
import { Notify } from 'quasar';
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
  setUserManager: jest.fn(() => Promise.resolve()),
  login: jest.fn(() => Promise.resolve()),
}));

describe('Test page component: LoginPage', () => {
  let wrapper;
  const authentication = [
    { name: 'Provider 1' },
    { name: 'Provider 2' },
    { name: 'Provider 3' },
  ];

  beforeEach(() => {
    wrapper = shallowMount(LoginPage);
  });

  describe('Test variables initialization', () => {
    describe('Test computed: providerList', () => {
      it('should be an empty array if process.env.AUTHENTICATION is null', async () => {
        expect(wrapper.vm.providerList).toEqual([]);
      });

      it('should contain the provider list items from process.env.AUTHENTICATION', async () => {
        process.env.AUTHENTICATION = JSON.stringify(authentication);

        expect(wrapper.vm.providerList).toEqual([
          { name: 'Provider 1' },
          { name: 'Provider 2' },
          { name: 'Provider 3' },
        ]);
      });
    });
  });

  describe('Test function: loginUser', () => {
    it('should login the user successfully', async () => {
      Notify.create = jest.fn();

      await wrapper.vm.loginUser('providerName');

      expect(UserAuthentication.setUserManager).toHaveBeenCalledWith('providerName');
      expect(UserAuthentication.login).toHaveBeenCalled();
      expect(Notify.create).not.toHaveBeenCalled();
    });

    it('should show an error notification on login failure', async () => {
      UserAuthentication.login.mockReturnValueOnce(Promise.reject());

      Notify.create = jest.fn();

      await wrapper.vm.loginUser();

      expect(Notify.create).toHaveBeenCalledWith({
        message: 'errors.authentication.login',
        html: true,
        type: 'negative',
      });
    });
  });
});
