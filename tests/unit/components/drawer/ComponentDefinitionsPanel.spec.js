import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ComponentDefinitionsDrawer from 'src/components/drawer/ComponentDefinitionsDrawer.vue';

installQuasarPlugin();

describe('Test component: ComponentDefinitionsDrawer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ComponentDefinitionsDrawer);
  });

  describe('Test function: scrollAreaHeight', () => {
    it('should should be a linear function ((Nkeys * 48) + 130)', () => {
      const keys = [];
      for (let i = 0; i < 10; i += 1) {
        const result = wrapper.vm.scrollAreaHeight(keys);
        expect(result).toEqual(130 + i * 48);
        keys.push(1);
      }
    });
  });
});
