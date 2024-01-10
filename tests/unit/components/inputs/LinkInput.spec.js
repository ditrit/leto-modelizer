import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import LinkInput from 'src/components/inputs/LinkInput';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import PluginEvent from 'src/composables/events/PluginEvent';

installQuasarPlugin();

jest.mock('src/composables/events/PluginEvent', () => ({
  DefaultEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test component: LinkInput', () => {
  let wrapper;
  let pluginDefaultSubscription;
  let pluginDefaultUnsubscription;

  beforeEach(() => {
    pluginDefaultSubscription = jest.fn();
    pluginDefaultUnsubscription = jest.fn();

    PluginEvent.DefaultEvent.subscribe.mockImplementation(() => {
      pluginDefaultSubscription();
      return { unsubscribe: pluginDefaultUnsubscription };
    });

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
            getComponentsByType: jest.fn(() => [{ id: 'componentName', externalId: 'externalId' }]),
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
        expect(wrapper.vm.options).toEqual([{ value: 'componentName', label: 'externalId' }]);
      });
    });

    describe('Test variable: iconName', () => {
      it('should match "linkIconName"', () => {
        expect(wrapper.vm.iconName).toEqual('iconName');
      });
    });
  });

  describe('Test function: updateOptions', () => {
    it('should update options array', () => {
      const event = {
        type: 'Drawer',
        status: 'success',
      };
      wrapper.vm.options = ['coucou'];

      wrapper.vm.updateOptions({ event });

      expect(wrapper.vm.options).toEqual([{
        label: 'externalId',
        value: 'componentName',
      }]);
    });
  });

  describe('Test watcher: props.plugin.data.components', () => {
    it('should be triggered when props.plugin.data.components is updated', async () => {
      expect(wrapper.vm.options).toEqual([{ value: 'componentName', label: 'externalId' }]);

      await wrapper.setProps({
        plugin: {
          data: {
            components: ['components'],
            getComponentsByType: jest.fn(() => [{ id: 'newComponentName', externalId: 'newExternalId' }]),
          },
        },
      });

      expect(wrapper.vm.options).toEqual([{ value: 'newComponentName', label: 'newExternalId' }]);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to DefaultEvent', () => {
      expect(pluginDefaultSubscription).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to DefaultEvent', () => {
      expect(pluginDefaultUnsubscription).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pluginDefaultUnsubscription).toHaveBeenCalledTimes(1);
    });
  });
});
