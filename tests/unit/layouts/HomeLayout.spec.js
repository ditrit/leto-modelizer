import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import HomeLayout from 'src/layouts/HomeLayout.vue';

installQuasarPlugin();

describe('Test page component: HomeLayout', () => {
  let wrapper;

  process.env.VERSION = 'version';

  beforeEach(() => {
    wrapper = shallowMount(HomeLayout, {
      global: {
        components: {
          'router-link': 'a',
        },
      },
    });
  });

  describe('Test component initialization', () => {
    describe('Test ref: version', () => {
      it('should match "version"', () => {
        expect(wrapper.vm.version).toEqual('version');
      });
    });
  });
});
