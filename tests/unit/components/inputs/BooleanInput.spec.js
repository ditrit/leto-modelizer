import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import BooleanInput from 'src/components/inputs/BooleanInput';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

describe('Test component: BooleanInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(BooleanInput, {
      props: {
        attribute: {
          name: 'attributeName',
          value: true,
        },
      },
      global: {
        stubs: {
          qToggle: true,
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
