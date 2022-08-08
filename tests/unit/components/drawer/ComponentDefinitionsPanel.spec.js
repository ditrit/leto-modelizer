import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ComponentDefinitionsPanel from 'src/components/drawer/ComponentDefinitionsPanel.vue';

installQuasarPlugin();

describe('Test component: ComponentDefinitionsPanel', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ComponentDefinitionsPanel);
  });

  describe('Test function: scrollAreaHeight', () => {
    it('Should should be a linear function ((Nkeys * 48) + 130)', () => {
      const keys = [];
      for (let i = 0; i < 10; i += 1) {
        const result = wrapper.vm.scrollAreaHeight(keys);
        expect(result).toEqual(130 + i * 48);
        keys.push(1);
      }
    });
  });
});
