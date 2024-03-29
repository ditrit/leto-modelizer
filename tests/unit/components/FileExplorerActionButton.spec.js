import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import FileExplorerActionButton from 'src/components/FileExplorerActionButton.vue';

installQuasarPlugin();

describe('Test component: FileExplorerActionButton', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileExplorerActionButton, {
      props: {
        file: { id: 'test' },
        projectName: 'projectName',
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: file', () => {
      it('should match file', () => {
        expect(wrapper.vm.file).toStrictEqual({ id: 'test' });
      });
    });

    describe('Test prop: projectName', () => {
      it('should match "projectName"', () => {
        expect(wrapper.vm.projectName).toStrictEqual('projectName');
      });
    });
  });

  describe('Test variables initialization', () => {
    describe('Test variable: isActionMenuOpen', () => {
      it('should be false', () => {
        expect(wrapper.vm.isActionMenuOpen).toEqual(false);
      });
    });
  });
});
