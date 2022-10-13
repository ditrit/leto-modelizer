import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import FileTabs from 'src/components/tab/FileTabs.vue';

installQuasarPlugin();

describe('Test component: FileTabs', () => {
  let wrapper;
  const $emit = jest.fn();

  beforeEach(() => {
    wrapper = shallowMount(FileTabs, {
      props: {
        files: [{ id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' }],
        modelValue: 'terraform/app.tf',
      },
      mocks: {
        $emit,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: files', () => {
      it('should match files', () => {
        const files = [{ id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' }];

        expect(wrapper.vm.props.files).toEqual(files);
      });
    });

    describe('Test props: modelValue', () => {
      it('should match modelValue', () => {
        const modelValue = 'terraform/app.tf';

        expect(wrapper.vm.props.modelValue).toEqual(modelValue);
      });
    });
  });

  describe('Test watcher: props.modelValue', () => {
    it('should be triggered when props.modelValue is updated with a different value', async () => {
      await wrapper.setProps({
        files: [{ id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' }],
        modelValue: 'README.md',
      });

      expect(wrapper.vm.internalActiveFile).toEqual('README.md');
    });
  });

  describe('Test watcher: internalActiveFile', () => {
    it('should be triggered when internalActiveFile value is updated and not equal to props.modelValue', async () => {
      await wrapper.setProps({
        files: [{ id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' }],
        modelValue: 'README.md',
      });

      wrapper.vm.internalActiveFile = 'terraform/app.tf';

      expect(wrapper.vm.props.modelValue).not.toEqual(wrapper.vm.internalActiveFile);

      wrapper.vm.$emit('update:modelValue', 'terraform/app.tf');

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['terraform/app.tf']);
    });

    it('should not be triggered when internalActiveFile value is updated and equal to props.modelValue', async () => {
      await wrapper.setProps({
        files: [{ id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' }],
        modelValue: 'README.md',
      });

      wrapper.vm.internalActiveFile = 'README.md';

      expect(wrapper.vm.props.modelValue).toEqual(wrapper.vm.internalActiveFile);
      expect(wrapper.emitted()['update:modelValue']).toBeFalsy();
    });
  });
});
