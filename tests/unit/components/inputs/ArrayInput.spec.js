import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ArrayInput from 'src/components/inputs/ArrayInput';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { ComponentAttributeDefinition } from 'leto-modelizer-plugin-core';

installQuasarPlugin();

describe('Test component: ArrayInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ArrayInput, {
      props: {
        attribute: {
          value: ['test'],
          definition: new ComponentAttributeDefinition(),
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
    wrapper.vm.arrayInput = {
      validate: jest.fn(() => Promise.resolve(true)),
    };
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
