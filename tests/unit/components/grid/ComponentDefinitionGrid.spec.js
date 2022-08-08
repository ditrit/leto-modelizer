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
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: definitions', () => {
      it('Should match array of component definitions', () => {
        expect(wrapper.vm.definitions).toStrictEqual([
          { type: 'foo1' },
          { type: 'foo2' },
        ]);
      });
    });
  });
});
