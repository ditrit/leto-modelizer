import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount, shallowMount } from '@vue/test-utils';
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
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(InputWrapper, {
      props: {
        attribute: {
          type: 'String',
          name: 'referenceTest',
          definition: {
            type: 'Reference',
            rules: {},
          },
        },
        plugin: {},
      },
      global: i18nPlugin,
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('should be equal to the given attribute', () => {
        expect(wrapper.vm.attribute).toEqual({
          type: 'String',
          name: 'referenceTest',
          definition: {
            type: 'Reference',
            rules: {},
          },
        });
      });
    });

    describe('Test prop: plugin', () => {
      it('should be equal to the given plugin', () => {
        expect(wrapper.vm.plugin).toEqual({});
      });
    });

    describe('Test variables: name', () => {
      it('should match attribute.name if attribute.definition is null', async () => {
        expect(wrapper.vm.name).toEqual('');
      });

      it('should be an empty string if attribute.definition is defined', async () => {
        wrapper = await mount(InputWrapper, {
          props: {
            attribute: {
              type: 'String',
              name: 'referenceTest',
            },
            plugin: {},
          },
          global: i18nPlugin,
        });
        expect(wrapper.vm.name).toEqual('referenceTest');
      });
    });
  });

  describe('Test function: getAttributeType', () => {
    it('should return "Select" if definition.rules.values is defined', () => {
      const attribute = {
        definition: {
          rules: {
            values: [],
          },
        },
      };
      expect(wrapper.vm.getAttributeType(attribute)).toEqual('Select');
    });

    it('should return definition.type if defined', () => {
      const attribute = {
        definition: {
          type: 'typeInDefinition',
          rules: {},
        },
      };
      expect(wrapper.vm.getAttributeType(attribute)).toEqual('typeInDefinition');
    });

    it('should return attribute.type if definition.type is undefined', () => {
      const attribute = {
        type: 'typeInAttribute',
      };
      expect(wrapper.vm.getAttributeType(attribute)).toEqual('typeInAttribute');
    });
  });

  describe('Test function: getAttributeLabel', () => {
    it('should return attribute name if attribute has a definition', () => {
      const attribute = {
        definition: {},
        name: 'nameTest',
      };
      expect(wrapper.vm.getAttributeLabel(attribute)).toEqual('nameTest');
    });

    it('should return empty string if attribute is a boolean', () => {
      const attribute = {
        type: 'Boolean',
        name: 'nameTest',
      };
      expect(wrapper.vm.getAttributeLabel(attribute)).toEqual('');
    });

    it('should return translation otherwise', () => {
      const attribute = {
        type: 'String',
      };
      expect(wrapper.vm.getAttributeLabel(attribute))
        .toEqual(wrapper.vm.$t('plugin.component.attribute.value'));
    });
  });
});
