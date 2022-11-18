import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
import StringInput from 'src/components/inputs/StringInput';

installQuasarPlugin();

describe('Test component: StringInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(StringInput, {
      props: {
        attribute: {
          value: 'test',
          name: 'attributeName',
          definition: {},
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('Should be an object containing name & value', () => {
        expect(wrapper.vm.attribute.name).toEqual('attributeName');
        expect(wrapper.vm.attribute.value).toEqual('test');
      });
    });

    describe('Test variables: localValue', () => {
      it('Should match attribute.value', () => {
        expect(wrapper.vm.localValue).toEqual('test');
      });
    });
  });
});
