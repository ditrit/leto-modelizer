import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ComponentDefinitionCard from 'src/components/card/ComponentDefinitionCard.vue';

installQuasarPlugin();

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
      it('Should match "component one"', () => {
        expect(wrapper.vm.definition).toStrictEqual({
          type: 'component one',
        });
      });
    });
  });
});
