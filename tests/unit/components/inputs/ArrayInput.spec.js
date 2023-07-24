import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ArrayInput from 'src/components/inputs/ArrayInput';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { ComponentAttributeDefinition } from 'leto-modelizer-plugin-core';

installQuasarPlugin();

describe('Test component: ArrayInput', () => {
  const global = {
    stubs: {
      qSelect: true,
    },
    plugins: [
      createI18n({
        locale: 'en-US',
        allowComposition: true,
        messages: i18nConfiguration,
      }),
    ],
  };

  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('should be an object containing value', () => {
        const wrapper = shallowMount(ArrayInput, {
          props: {
            attribute: {
              value: ['test'],
              definition: new ComponentAttributeDefinition(),
            },
          },
          global,
        });
        wrapper.vm.arrayInput = {
          validate: jest.fn(() => Promise.resolve(true)),
        };
        expect(wrapper.vm.attribute.value).toEqual(['test']);
      });
    });

    describe('Test variable: localValue', () => {
      it('should match attribute.value', () => {
        const wrapper = shallowMount(ArrayInput, {
          props: {
            attribute: {
              value: ['test'],
              definition: new ComponentAttributeDefinition(),
            },
          },
          global,
        });
        wrapper.vm.arrayInput = {
          validate: jest.fn(() => Promise.resolve(true)),
        };
        expect(wrapper.vm.localValue).toEqual(['test']);
      });
    });

    describe('Test variable: options', () => {
      it('should not be null when the attribute has a definition and rules with values', () => {
        const wrapper = shallowMount(ArrayInput, {
          props: {
            attribute: {
              value: ['test'],
              definition: new ComponentAttributeDefinition({
                rules: {
                  values: ['value1', 'value2', 'value3'],
                },
              }),
            },
          },
          global,
        });
        wrapper.vm.arrayInput = {
          validate: jest.fn(() => Promise.resolve(true)),
        };
        expect(wrapper.vm.options).toEqual(['value1', 'value2', 'value3']);
      });

      it('should be null when the attribute has a definition with no rules', () => {
        const wrapper = shallowMount(ArrayInput, {
          props: {
            attribute: {
              value: ['test'],
              definition: new ComponentAttributeDefinition(),
            },
          },
          global,
        });
        wrapper.vm.arrayInput = {
          validate: jest.fn(() => Promise.resolve(true)),
        };
        expect(wrapper.vm.options).toBeNull();
      });

      it('should be null and not raise an error when the attribute has no definition', () => {
        const wrapper = shallowMount(ArrayInput, {
          props: {
            attribute: {
              value: ['test'],
              definition: null,
            },
          },
          global,
        });
        wrapper.vm.arrayInput = {
          validate: jest.fn(() => Promise.resolve(true)),
        };
        expect(wrapper.vm.options).toBeNull();
      });
    });
  });
});
