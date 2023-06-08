import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import TagSelectInput from 'src/components/inputs/TagSelectInput.vue';

installQuasarPlugin();

describe('Test component: TagSelectInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TagSelectInput, {
      global: {
        stubs: {
          qSelect: true,
        },
      },
    });
  });

  describe('Test function: unselectTag', () => {
    it('should emit an event with all selected tags', async () => {
      await wrapper.setProps({
        modelValue: ['a', 'b'],
      });

      wrapper.vm.unselectTag('b');

      expect(wrapper.emitted()['update:modelValue']).toEqual([[['a']]]);
    });
  });

  describe('Test watcher: props.modelValue', () => {
    it('should be triggered when props.modelValue is updated', async () => {
      expect(wrapper.vm.modelValue).toEqual([]);

      await wrapper.setProps({
        modelValue: ['a'],
      });

      expect(wrapper.vm.modelValue).toEqual(['a']);
    });
  });
});
