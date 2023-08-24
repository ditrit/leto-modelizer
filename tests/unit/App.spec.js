import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import App from 'src/App.vue';
import UserAuthentication from 'src/composables/UserAuthentication';

installQuasarPlugin();

jest.mock('src/composables/UserAuthentication', () => ({
  setUserManager: jest.fn(),
}));

describe('Test component: App', () => {
  shallowMount(App, {
    global: {
      stubs: [
        'router-view',
      ],
    },
  });

  describe('Test function: onMounted', () => {
    it('should call setUserManager', () => {
      expect(UserAuthentication.setUserManager).toHaveBeenCalled();
    });
  });
});
