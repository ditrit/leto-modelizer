import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import InputWrapper from 'src/components/inputs/InputWrapper.vue';

installQuasarPlugin();

describe('Test component: InputWrapper', () => {
  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('should has type "String"', async () => {
        const wrapper = await shallowMount(InputWrapper, {
          props: {
            attribute: {
              type: 'String',
              name: 'stringTest',
              definition: {
                type: 'String',
              },
            },
            plugin: {},
          },
        });
        expect(wrapper.vm.attribute.definition.type).toBe('String');
      });

      it('should has type "Number"', async () => {
        const wrapper = await shallowMount(InputWrapper, {
          props: {
            attribute: {
              type: 'Number',
              name: 'NumberTest',
              definition: {
                type: 'Number',
              },
            },
            plugin: {},
          },
        });
        expect(wrapper.vm.attribute.definition.type).toBe('Number');
      });

      it('should has type "Boolean"', async () => {
        const wrapper = await shallowMount(InputWrapper, {
          props: {
            attribute: {
              type: 'Boolean',
              name: 'booleanTest',
              definition: {
                type: 'Boolean',
              },
            },
            plugin: {},
          },
        });
        expect(wrapper.vm.attribute.definition.type).toBe('Boolean');
      });

      it('should has type "Reference"', async () => {
        const wrapper = await shallowMount(InputWrapper, {
          props: {
            attribute: {
              type: 'String',
              name: 'referenceTest',
              definition: {
                type: 'Reference',
              },
            },
            plugin: {},
          },
        });
        expect(wrapper.vm.attribute.definition.type).toBe('Reference');
      });
    });
  });
});
