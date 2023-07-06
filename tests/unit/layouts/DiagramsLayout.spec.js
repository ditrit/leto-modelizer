import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import DiagramsLayout from 'src/layouts/DiagramsLayout.vue';

installQuasarPlugin();

describe('Test page component: DiagramsLayout', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DiagramsLayout, {});
  });

  describe('Test component initialization', () => {
    it('should be defined', () => {
      expect(wrapper.vm).toBeDefined();
    });
  });
});
