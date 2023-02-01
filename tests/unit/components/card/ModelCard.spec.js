import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelCard from 'src/components/card/ModelCard.vue';

installQuasarPlugin();

describe('Test component: ModelCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ModelCard, {
      props: { model: { name: 'modelName' } },
    });
  });

  describe('Test prop: model', () => {
    it('should match "modelName"', () => {
      expect(wrapper.vm.model).toStrictEqual({ name: 'modelName' });
    });
  });
});
