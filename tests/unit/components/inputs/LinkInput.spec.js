import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import LinkInput from 'src/components/inputs/LinkInput';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

describe('Test component: LinkInput', () => {
  let wrapper;

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
          },
        },
      },
      global: {
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

    describe('Test variable: options', () => {
      it('should be an array', () => {
        expect(wrapper.vm.options).toEqual(['componentName']);
      });
    });

    describe('Test variable: iconName', () => {
      it('should match "linkIconName"', () => {
        expect(wrapper.vm.iconName).toEqual('iconName');
      });
    });
  });

  // TODO: REF.value.validate is not a function
  describe.skip('Test watcher: props.plugin.components', () => {
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
      expect(wrapper.vm.options).toEqual(['componentName']);
    });
  });
});
