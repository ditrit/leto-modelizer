import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import FileTabHeader from 'src/components/tab/FileTabHeader.vue';

installQuasarPlugin();

describe('Test component: FileTabHeader', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileTabHeader, {
      props: {
        file: { id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' },
        isActive: false,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: file', () => {
      it('should match file', () => {
        const file = { id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' };

        expect(wrapper.vm.file).toEqual(file);
      });
    });

    describe('Test props: isActive', () => {
      it('should be false', () => {
        expect(wrapper.vm.isActive).toEqual(false);
      });
    });
  });
});
