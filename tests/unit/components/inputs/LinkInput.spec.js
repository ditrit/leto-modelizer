import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import LinkInput from 'src/components/inputs/LinkInput';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

describe('Test component: LinkInput', () => {
  let wrapper;

  const options = [{
    name: 'default',
    type: 'category',
    children: [{
      type: 'item',
      value: 'componentName',
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
    wrapper = shallowMount(LinkInput, {
      props: {
        attribute: {
          value: ['test'],
          name: 'attributeName',
          definition: {
            linkRef: 'linkable',
          },
        },
        plugin: {
          data: {
            name: 'pluginName',
            components: [],
            definitions: {
              components: [{
                type: 'linkable',
                icon: 'iconName',
              }],
            },
            getComponentsByType: jest.fn(() => [{ id: 'componentName' }]),
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
    wrapper.vm.linkInput = {
      validate: jest.fn(() => Promise.resolve(true)),
    };
  });

  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('should be an object containing name & value', () => {
        expect(wrapper.vm.attribute.name).toEqual('attributeName');
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

    describe('Test variable: iconName', () => {
      it('should match "linkIconName"', () => {
        expect(wrapper.vm.iconName).toEqual('iconName');
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
          definition: {
            linkRef: 'linkable',
          },
        },
        plugin: {
          data: {
            getComponentsByType: jest.fn(() => [{ id: 'componentName' }]),
            name: 'pluginName',
            components: [{
              name: 'componentName',
              definition: {
                type: 'linkable',
              },
            }],
            definitions: {
              components: [{
                type: 'linkable',
                icon: 'iconName',
              }],
            },
          },
        },
      });

      expect(wrapper.vm.options).toEqual(options);
    });
  });
});
