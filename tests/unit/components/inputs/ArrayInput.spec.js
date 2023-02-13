import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ArrayInput from 'src/components/inputs/ArrayInput';

installQuasarPlugin();

// TODO : shallowMount and Quasar test not working due to some property error (prefix)
describe.skip('Test component: ArrayInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ArrayInput, {
      props: {
        attribute: {
          value: ['test'],
          definition: {},
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('should be an object containing value', () => {
        expect(wrapper.vm.attribute.value).toEqual(['test']);
      });
    });

    describe('Test variable: localValue', () => {
      it('should match attribute.value', () => {
        expect(wrapper.vm.localValue).toEqual(['test']);
      });
    });
  });
});
