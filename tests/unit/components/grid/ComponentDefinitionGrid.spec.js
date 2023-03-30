import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ComponentDefinitionGrid from 'src/components/grid/ComponentDefinitionGrid.vue';

installQuasarPlugin();

describe('Test component: ComponentDefinitionGrid', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ComponentDefinitionGrid, {
      props: {
        definitions: [
          { type: 'foo1' },
          { type: 'foo2' },
        ],
        pluginName: 'plugin',
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: definitions', () => {
      it('should match array of component definitions', () => {
        expect(wrapper.vm.definitions).toStrictEqual([
          { type: 'foo1' },
          { type: 'foo2' },
        ]);
      });
    });

    describe('Test prop: pluginName', () => {
      it('should match "plugin"', () => {
        expect(wrapper.vm.pluginName).toStrictEqual('plugin');
      });
    });
  });
});
