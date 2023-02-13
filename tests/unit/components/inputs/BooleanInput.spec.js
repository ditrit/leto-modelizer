import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import BooleanInput from 'src/components/inputs/BooleanInput';

installQuasarPlugin();

// TODO : shallowMount and Quasar test not working due to some property error (prefix)
describe.skip('Test component: BooleanInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(BooleanInput, {
      props: {
        attribute: {
          name: 'attributeName',
          value: true,
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('should be an object containing name & value', () => {
        expect(wrapper.vm.attribute.name).toEqual('attributeName');
        expect(wrapper.vm.attribute.value).toEqual(true);
      });
    });

    describe('Test variable: localValue', () => {
      it('should match attribute.value', () => {
        expect(wrapper.vm.localValue).toEqual(true);
      });
    });
  });
});
