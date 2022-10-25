import { shallowMount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import DialogEvent from 'src/composables/events/DialogEvent';
import FileExplorerActionMenu from 'components/menu/FileExplorerActionMenu';

installQuasarPlugin();

describe('Test component: FileExplorerActionMenu', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileExplorerActionMenu, {
      props: {
        file: { id: 'test' },
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: file', () => {
      it('should match file', () => {
        expect(wrapper.vm.file).toStrictEqual({ id: 'test' });
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: addFile', () => {
      it('should call dialog event to create file', () => {
        DialogEvent.next = jest.fn(() => Promise.resolve({
          type: 'open',
          key: 'CreateFile',
          file: wrapper.vm.file,
          isFolder: false,
        }));
        wrapper.vm.addFile(false);
        expect(DialogEvent.next).toBeCalled();
      });

      it('should call dialog event to create folder', () => {
        DialogEvent.next = jest.fn(() => Promise.resolve({
          type: 'open',
          key: 'CreateFile',
          file: wrapper.vm.file,
          isFolder: true,
        }));
        wrapper.vm.addFile(true);
        expect(DialogEvent.next).toBeCalled();
      });
    });

    describe('Test function: deleteFile', () => {
      it('should call dialog event', () => {
        DialogEvent.next = jest.fn(() => Promise.resolve({
          type: 'open',
          key: 'DeleteFile',
          file: wrapper.vm.file,
        }));
        wrapper.vm.deleteFile();
        expect(DialogEvent.next).toBeCalled();
      });
    });
  });
});
