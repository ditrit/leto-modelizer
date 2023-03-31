import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import MainLayout from 'src/layouts/MainLayout.vue';
import { useRoute } from 'vue-router';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

describe('Test page component: MainLayout', () => {
  let wrapper;

  const global = {
    plugins: [
      createI18n({ locale: 'en-US', messages: i18nConfiguration }),
    ],
    components: {
      'router-link': 'a',
    },
    stubs: [
      'router-view',
    ],
  };

  describe('Test computed: viewType', () => {
    it('should match route.params.viewType', () => {
      useRoute.mockImplementation(() => ({
        params: {
          viewType: '',
        },
      }));

      wrapper = shallowMount(MainLayout, {
        global,
      });

      expect(wrapper.vm.viewType).toEqual('');
    });
  });

  describe('Test computed: show', () => {
    it('should be true when viewType is different from "text" and from "draw"', () => {
      useRoute.mockImplementation(() => ({
        params: {
          viewType: '',
        },
      }));

      wrapper = shallowMount(MainLayout, {
        global,
      });

      expect(wrapper.vm.show).toEqual(true);
    });

    it('should be false when viewType is equal "text"', () => {
      useRoute.mockImplementation(() => ({
        params: {
          viewType: 'text',
        },
      }));

      wrapper = shallowMount(MainLayout, {
        global,
      });

      expect(wrapper.vm.viewType).toEqual('text');
      expect(wrapper.vm.show).toEqual(false);
    });

    it('should be false when viewType is equal "draw"', () => {
      useRoute.mockImplementation(() => ({
        params: {
          viewType: 'draw',
        },
      }));

      wrapper = shallowMount(MainLayout, {
        global,
      });

      expect(wrapper.vm.show).toEqual(false);
    });
  });
});
