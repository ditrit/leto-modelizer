import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
import ReferenceInput from 'src/components/inputs/ReferenceInput';

installQuasarPlugin();

describe('Test component: ReferenceInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ReferenceInput, {
      props: {
        attribute: {
          value: 'test',
          name: 'attributeName',
          definition: {
            containerRef: 'reference',
          },
        },
        plugin: {
          data: {
            name: 'pluginName',
            components: [],
            definitions: {
              components: [{
                type: 'reference',
                icon: 'referenceIconName',
              }],
            },
            getComponentsByType: jest.fn(() => [{ id: 'ref' }]),
          },
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: attribute', () => {
      it('should be an object containing name & value', () => {
        expect(wrapper.vm.attribute.name).toEqual('attributeName');
        expect(wrapper.vm.attribute.value).toEqual('test');
      });
    });

    describe('Test prop: plugin', () => {
      it('should be an object containing a name mathing "pluginName"', () => {
        expect(wrapper.vm.plugin.data.name).toEqual('pluginName');
      });
    });

    describe('Test variables: localValue', () => {
      it('should match attribute.value', () => {
        expect(wrapper.vm.localValue).toEqual('test');
      });
    });

    describe('Test variables: options', () => {
      it('should be an array', () => {
        expect(wrapper.vm.options).toEqual(['ref']);
      });
    });

    describe('Test variables: iconName', () => {
      it('should match "referenceIconName"', () => {
        expect(wrapper.vm.iconName).toEqual('referenceIconName');
      });
    });
  });

  describe('Test watcher: props.plugin.components', () => {
    it('should update options', async () => {
      await wrapper.setProps({
        attribute: {
          value: 'test',
          name: 'attributeName',
          definition: {
            containerRef: 'reference',
          },
        },
        plugin: {
          data: {
            getComponentsByType: jest.fn(() => [{ id: 'ref' }]),
            name: 'pluginName',
            components: [{
              name: 'ref',
              definition: {
                type: 'reference',
              },
            }],
            definitions: {
              components: [{
                type: 'reference',
                icon: 'referenceIconName',
              }],
            },
          },
        },
      });
      expect(wrapper.vm.options).toEqual(['ref']);
    });
  });
});
