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
            },
          },
        });
        expect(wrapper.vm.attribute.type).toBe('String');
      });

      it('should has type "Number"', async () => {
        const wrapper = await shallowMount(InputWrapper, {
          props: {
            attribute: {
              type: 'Number',
              name: 'NumberTest',
            },
          },
        });
        expect(wrapper.vm.attribute.type).toBe('Number');
      });

      it('should has type "Boolean"', async () => {
        const wrapper = await shallowMount(InputWrapper, {
          props: {
            attribute: {
              type: 'Boolean',
              name: 'stringTest',
            },
          },
        });
        expect(wrapper.vm.attribute.type).toBe('Boolean');
      });
    });
  });
});
