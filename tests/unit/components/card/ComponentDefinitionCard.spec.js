import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { useRoute } from 'vue-router';
import ComponentDefinitionCard from 'src/components/card/ComponentDefinitionCard.vue';
import { renderPlugin } from 'src/composables/PluginManager';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

const testPlugin = {
  draw: null,
  data: {
    addComponent: null,
  },
};

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: () => testPlugin,
  renderPlugin: jest.fn(() => Promise.resolve([])),
}));

describe('Test component: ComponentDefinitionCard', () => {
  let wrapper;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
    },
  }));

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
        const definition = { type: 'component one' };
        const addComponent = jest.fn();
        testPlugin.data.addComponent = addComponent;

        wrapper.vm.onClickItem();
        expect(addComponent).toBeCalledWith(definition);
        expect(renderPlugin).toBeCalledWith('plugin', 'project-00000000');
      });
    });
  });
});
