import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ArrayInput from 'src/components/inputs/ArrayInput';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

describe('Test component: ArrayInput', () => {
  let wrapper;

  const options = [{
    name: 'plugin.component.attribute.selectInput.defaultValue',
    type: 'category',
    children: [{
      type: 'item',
      value: 'value1',
    }, {
      type: 'item',
      value: 'value2',
    }],
  }, {
    name: 'plugin.component.attribute.selectInput.variables',
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
    wrapper = shallowMount(ArrayInput, {
      props: {
        attribute: {
          value: ['test'],
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
            name: 'pluginName',
            components: [],
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

    describe('Test prop: plugin', () => {
      it('should be an object containing a name mathing "pluginName"', () => {
        expect(wrapper.vm.plugin.data.name).toEqual('pluginName');
      });
    });

    describe('Test variable: localValue', () => {
      it('should match attribute.value', () => {
        expect(wrapper.vm.localValue).toEqual(['test']);
      });
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

  describe('Test hook function: onMounted', () => {
    it('should init options', () => {
      expect(wrapper.vm.options).toEqual(options);
    });
  });
});
