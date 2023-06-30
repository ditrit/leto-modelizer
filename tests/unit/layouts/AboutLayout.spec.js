import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import AboutLayout from 'src/layouts/AboutLayout.vue';

installQuasarPlugin();

describe('Test page component: AboutLayout', () => {
  let wrapper;

  process.env.VERSION = 'version';

  beforeEach(() => {
    wrapper = shallowMount(AboutLayout, {
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
