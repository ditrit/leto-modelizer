import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount, mount } from '@vue/test-utils';
import InputWrapper from 'src/components/inputs/InputWrapper.vue';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

const i18nPlugin = {
  plugins: [
    createI18n({
      locale: 'en-US',
      allowComposition: true,
      messages: i18nConfiguration,
    }),
  ],
};

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
          global: i18nPlugin,
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
          global: i18nPlugin,
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
          global: i18nPlugin,
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
          global: i18nPlugin,
        });
        expect(wrapper.vm.attribute.definition.type).toBe('Reference');
      });
    });

    describe('Test variables: attributeType', () => {
      it('should match attribute.definition.type', async () => {
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
          global: i18nPlugin,
        });
        expect(wrapper.vm.attributeType).toEqual('Reference');
      });

      it('should match attribute.type if attribute.definition is null', async () => {
        const wrapper = await mount(InputWrapper, {
          props: {
            attribute: {
              type: 'String',
              name: 'referenceTest',
              definition: null,
            },
            plugin: {},
          },
          global: i18nPlugin,
        });
        expect(wrapper.vm.attributeType).toEqual('String');
      });
    });

    describe('Test variables: name', () => {
      it('should match attribute.name if attribute.definition is null', async () => {
        const wrapper = await mount(InputWrapper, {
          props: {
            attribute: {
              type: 'String',
              name: 'referenceTest',
              definition: null,
            },
            plugin: {},
          },
          global: i18nPlugin,
        });
        expect(wrapper.vm.name).toEqual('referenceTest');
      });

      it('should be an empty string if attribute.definition is defined', async () => {
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
          global: i18nPlugin,
        });
        expect(wrapper.vm.name).toEqual('');
      });
    });

    describe('Test computed: label', () => {
      it('should match attribute.name if attribute.definition is defined', async () => {
        const wrapper = await shallowMount(InputWrapper, {
          props: {
            attribute: {
              type: 'String',
              name: 'attributeName',
              definition: {
                type: 'Reference',
              },
            },
            plugin: {},
          },
          global: i18nPlugin,
        });
        expect(wrapper.vm.label).toEqual('attributeName');
      });

      it('should be an empty string if attribute.definition is null and attribute.type is "Boolean"', async () => {
        const wrapper = await mount(InputWrapper, {
          props: {
            attribute: {
              type: 'Boolean',
              name: 'attributeName',
              definition: null,
            },
            plugin: {},
          },
          global: i18nPlugin,
        });
        expect(wrapper.vm.label).toEqual('');
      });

      it('should return attribute.value translation if attribute.definition is null and attribute.type is not "Boolean"', async () => {
        const wrapper = await mount(InputWrapper, {
          props: {
            attribute: {
              type: 'String',
              name: 'attributeName',
              definition: null,
            },
            plugin: {},
          },
          global: i18nPlugin,
        });
        expect(wrapper.vm.label).toEqual('value');
      });
    });
  });
});
