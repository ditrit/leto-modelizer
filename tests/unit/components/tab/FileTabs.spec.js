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
        modelValue: { isSelected: true, id: 'terraform/app.tf' },
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
        const modelValue = { isSelected: true, id: 'terraform/app.tf' };

        expect(wrapper.vm.props.modelValue).toEqual(modelValue);
      });
    });
  });

  describe('Test watcher: props.modelValue', () => {
    it('should be triggered when props.modelValue is updated with a different value', async () => {
      await wrapper.setProps({
        files: [{ id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' }],
        modelValue: { isSelected: true, id: 'README.md' },
      });

      expect(wrapper.vm.activeFileId).toEqual('README.md');
    });
  });

  describe('Test watcher: activeFileId', () => {
    it('should be triggered when activeFileId value is updated and not equal to props.modelValue.id', async () => {
      await wrapper.setProps({
        files: [{ id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' }],
        modelValue: { isSelected: true, id: 'README.md' },
      });

      wrapper.vm.activeFileId = 'terraform/app.tf';

      expect(wrapper.vm.props.modelValue.id).not.toEqual(wrapper.vm.activeFileId);

      wrapper.vm.$emit('update:modelValue', { isSelected: true, id: 'terraform/app.tf' });

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual([{ isSelected: true, id: 'terraform/app.tf' }]);
    });

    it('should not be triggered when activeFileId value is updated and equal to props.modelValue.id', async () => {
      await wrapper.setProps({
        files: [{ id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' }],
        modelValue: { isSelected: true, id: 'README.md' },
      });

      wrapper.vm.activeFileId = 'README.md';

      expect(wrapper.vm.props.modelValue.id).toEqual(wrapper.vm.activeFileId);
      expect(wrapper.emitted()['update:modelValue']).toBeFalsy();
    });
  });
});
