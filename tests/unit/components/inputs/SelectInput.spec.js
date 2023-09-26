import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import SelectInput from 'src/components/inputs/SelectInput';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

describe('Test component: SelectInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SelectInput, {
      props: {
        attribute: {
          name: 'attributeName',
          value: 'value1',
          definition: {
            rules: {
              values: [
                'value1',
                'value2',
              ],
            },
          },
        },
      },
      global: {
        stubs: {
          qSelect: true,
        },
        plugins: [
          createI18n({
            locale: 'en-US',
            messages: i18nConfiguration,
          }),
        ],
      },
    });
    wrapper.vm.selectInput = {
      validate: jest.fn(() => Promise.resolve(true)),
    };
  });

  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('should be an object containing name & value', () => {
        expect(wrapper.vm.attribute.name).toEqual('attributeName');
        expect(wrapper.vm.attribute.value).toEqual('value1');
      });
    });

    describe('Test variable: localValue', () => {
      it('should match attribute.value', () => {
        expect(wrapper.vm.localValue).toEqual('value1');
      });
    });

    describe('Test variable: option', () => {
      it('should match attribute.definition.rules.values', () => {
        expect(wrapper.vm.options).toEqual([
          'value1',
          'value2',
        ]);
      });
    });
  });
});
