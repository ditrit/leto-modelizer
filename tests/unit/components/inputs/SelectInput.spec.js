import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import SelectInput from 'src/components/inputs/SelectInput';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { ComponentAttributeDefinition } from 'leto-modelizer-plugin-core';

installQuasarPlugin();

describe('Test component: SelectInput', () => {
  let wrapper;

  const options = [{
    name: 'default',
    type: 'category',
    children: [{
      type: 'item',
      value: 'value1',
    }, {
      type: 'item',
      value: 'value2',
    }],
  }, {
    name: 'variable',
    type: 'category',
    children: [{
      name: 'variable',
      type: 'category',
      children: [{
        name: 'variableName',
        formattedName: 'var.variableName',
        value: 'variableValue',
        type: 'item',
      }],
    }],
  }];
  const qSelectStub = {
    template: `
      <div>
        <slot name="prepend"></slot>
        <slot></slot>
      </div>
    `,
    props: ['value', 'options', 'rules'],
    methods: {
      validate: jest.fn(),
    },
  };
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
        plugin: {
          data: {
            variables: [{
              category: 'variable',
              name: 'variableName',
              formattedName: 'var.variableName',
              value: 'variableValue',
            }],
          },
        },
      },
      global: {
        stubs: {
          qSelect: qSelectStub,
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
  });

  describe('Test function: initOptions', () => {
    it('should init options', () => {
      expect(wrapper.vm.options).toEqual(options);
    });
  });

  describe('Test watcher: props.plugin.data.components', () => {
    it('should update options', async () => {
      await wrapper.setProps({
        attribute: {
          value: ['test'],
          name: 'attributeName',
          definition: new ComponentAttributeDefinition(),
        },
        plugin: {
          data: {
            getComponentsByType: jest.fn(() => [{ id: 'componentName' }]),
            name: 'pluginName',
            components: [{
              name: 'componentName',
            }],
          },
        },
      });

      expect(wrapper.vm.options).toEqual(options);
    });
  });

  describe('Test watcher: props.attributes', () => {
    it('should update localValue when props.attribute.value is defined', async () => {
      await wrapper.setProps({
        attribute: {
          value: ['updatedValue'],
          name: 'attributeName',
        },
      });

      expect(wrapper.vm.localValue).toEqual(['updatedValue']);
    });
  });
});
