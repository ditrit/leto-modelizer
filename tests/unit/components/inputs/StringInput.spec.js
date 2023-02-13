import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import StringInput from 'src/components/inputs/StringInput';

installQuasarPlugin();

// TODO : shallowMount and Quasar test not working due to some property error (prefix)
describe.skip('Test component: StringInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(StringInput, {
      props: {
        attribute: {
          value: 'test',
          name: 'attributeName',
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('should be an object containing name & value', () => {
        expect(wrapper.vm.attribute.name).toEqual('attributeName');
        expect(wrapper.vm.attribute.value).toEqual('test');
      });
    });

    describe('Test variables: localValue', () => {
      it('should match attribute.value', () => {
        expect(wrapper.vm.localValue).toEqual('test');
      });
    });
  });
});
