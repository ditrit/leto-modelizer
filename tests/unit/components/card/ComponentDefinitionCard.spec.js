import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ComponentDefinitionCard from 'src/components/card/ComponentDefinitionCard.vue';
import { Component } from 'leto-modelizer-plugin-core';

installQuasarPlugin();

const testPlugin = {
  metadata: {},
  parser: {},
  renderer: {},
  drawer: {},
  components: [],
};

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: () => testPlugin,
}));
jest.mock('src/composables/Random', () => ({
  randomHexString: () => 0x16,
}));

describe('Test component: ComponentDefinitionCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ComponentDefinitionCard, {
      props: {
        definition: {
          type: 'component one',
        },
        pluginName: 'plugin',
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: component', () => {
      it('should match "component one"', () => {
        expect(wrapper.vm.definition).toStrictEqual({
          type: 'component one',
        });
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: onClickItem', () => {
      it('should draw components array with one element', () => {
        window.crypto = {
          getRandomValues: () => 0x16,
        };
        const draw = jest.fn();
        testPlugin.drawer = { draw };

        wrapper.vm.onClickItem();
        expect(draw).toBeCalledWith([new Component({
          definition: { type: 'component one' },
          id: `object_${0x16}`,
          name: `object_${0x16}`,
        })]);
      });
    });
  });
});
