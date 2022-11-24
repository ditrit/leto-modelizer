import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ComponentDefinitionCard from 'src/components/card/ComponentDefinitionCard.vue';

installQuasarPlugin();

const testPlugin = {
  draw: null,
  data: {
    addComponent: null,
  },
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

        const id = `${0x16}`;
        const definition = { type: 'component one' };
        const draw = jest.fn();
        const addComponent = jest.fn();
        testPlugin.draw = draw;
        testPlugin.data.addComponent = addComponent;

        wrapper.vm.onClickItem();
        expect(addComponent).toBeCalledWith(`${definition.type}_${id}`, definition);
        expect(draw).toBeCalledWith('root');
      });
    });
  });
});
