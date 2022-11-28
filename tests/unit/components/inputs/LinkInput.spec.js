import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
import LinkInput from 'src/components/inputs/LinkInput';

installQuasarPlugin();

describe('Test component: LinkInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(LinkInput, {
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
            getComponentsByType: jest.fn(() => [{ name: 'componentName' }]),
          },
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('Should be an object containing name & value', () => {
        expect(wrapper.vm.attribute.name).toEqual('attributeName');
        expect(wrapper.vm.attribute.value).toEqual(['test']);
      });
    });

    describe('Test prop: plugin', () => {
      it('Should be an object containing a name mathing "pluginName"', () => {
        expect(wrapper.vm.plugin.data.name).toEqual('pluginName');
      });
    });

    describe('Test variable: localValue', () => {
      it('Should match attribute.value', () => {
        expect(wrapper.vm.localValue).toEqual(['test']);
      });
    });

    describe('Test variable: options', () => {
      it('Should be an array', () => {
        expect(wrapper.vm.options).toEqual(['componentName']);
      });
    });

    describe('Test variable: iconName', () => {
      it('Should match "linkIconName"', () => {
        expect(wrapper.vm.iconName).toEqual('iconName');
      });
    });
  });

  describe('Test watcher: props.plugin.components', () => {
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
            getComponentsByType: jest.fn(() => [{ name: 'componentName' }]),
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
      expect(wrapper.vm.options).toEqual(['componentName']);
    });
  });
});
