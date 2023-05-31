import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import StringInput from 'src/components/inputs/StringInput';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

describe('Test component: StringInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(StringInput, {
      props: {
        attribute: {
          value: 'test',
          name: 'attributeName',
        },
      },
      global: {
        stubs: {
          qInput: true,
        },
        plugins: [
          createI18n({
            locale: 'en-US',
            allowComposition: true,
            messages: i18nConfiguration,
          }),
        ],
      },
    });
    wrapper.vm.stringInput = {
      validate: jest.fn(() => Promise.resolve(true)),
    };
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
