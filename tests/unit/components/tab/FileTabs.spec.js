import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import FileTabs from 'src/components/tab/FileTabs.vue';
import FileEvent from 'src/composables/events/FileEvent';

installQuasarPlugin();

jest.mock('src/composables/events/FileEvent', () => ({
  SelectFileNodeEvent: {
    subscribe: jest.fn(),
  },
  SelectFileTabEvent: {
    next: jest.fn(),
  },
}));

describe('Test component: FileTabs', () => {
  let wrapper;
  let selectFileNodeSubscribe;
  let selectFileNodeUnsubscribe;
  let selectFileTabNext;

  beforeEach(() => {
    selectFileNodeSubscribe = jest.fn();
    selectFileNodeUnsubscribe = jest.fn();
    selectFileTabNext = jest.fn();

    FileEvent.SelectFileTabEvent.next.mockImplementation(selectFileTabNext);
    FileEvent.SelectFileNodeEvent.subscribe.mockImplementation(() => {
      selectFileNodeSubscribe();
      return { unsubscribe: selectFileNodeUnsubscribe };
    });

    wrapper = shallowMount(FileTabs, {
      props: {
        fileInformations: [{ path: 'terraform/app.tf' }],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: fileInformations', () => {
      it('should match props.fileInformations', () => {
        expect(wrapper.vm.props.fileInformations).toEqual([{ path: 'terraform/app.tf' }]);
      });
    });

    describe('Test variable: fileTabArray', () => {
      it('should be an empty array', () => {
        expect(wrapper.vm.fileTabArray).toEqual([]);
      });
    });

    describe('Test variable: activeFileId', () => {
      it('should be null', () => {
        expect(wrapper.vm.activeFileId).toEqual(null);
      });
    });
  });

  describe('Test function: setLastFileActive', () => {
    it('should set activeFileId to null and emit SelectFileTabEvent', () => {
      wrapper.vm.fileTabArray = [];

      wrapper.vm.setLastFileActive();

      expect(wrapper.vm.activeFileId).toEqual(null);
      expect(selectFileTabNext).toBeCalled();
    });

    it('should set activeFileId to the last element of fileTabArray and emit SelectFileTabEvent', () => {
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf' }, { id: 'README.md' }];

      wrapper.vm.setLastFileActive();

      expect(wrapper.vm.activeFileId).toEqual('README.md');
      expect(selectFileTabNext).toBeCalled();
    });
  });

  describe('Test function: deleteFileTab', () => {
    it('should remove deleted file from fileTabArray', () => {
      wrapper.vm.activeFileId = 'terraform/app.tf';
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf' }, { id: 'README.md' }];

      wrapper.vm.deleteFileTab('README.md');

      expect(wrapper.vm.activeFileId).toEqual('terraform/app.tf');
      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf' }]);
    });

    it('should remove deleted file from fileTabArray, update activeFileId and emit SelectFileTabEvent', () => {
      wrapper.vm.activeFileId = 'README.md';
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf' }, { id: 'README.md' }];

      wrapper.vm.deleteFileTab('README.md');

      expect(wrapper.vm.activeFileId).toEqual('terraform/app.tf');
      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf' }]);
      expect(selectFileTabNext).toBeCalled();
    });
  });

  describe('Test function: onSelectFileNode', () => {
    it('should add selected file to fileTabArray and update activeFileId', () => {
      wrapper.vm.activeFileId = 'terraform/app.tf';
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf' }, { id: 'README.md' }];

      wrapper.vm.onSelectFileNode({ id: 'newFile.js', label: 'newFile.js' });

      expect(wrapper.vm.activeFileId).toEqual('newFile.js');
      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf' }, { id: 'README.md' }, { id: 'newFile.js', label: 'newFile.js' }]);
    });

    it('should only update activeFileId if fileTabArray already contains selected file', () => {
      wrapper.vm.activeFileId = 'terraform/app.tf';
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf' }, { id: 'README.md' }];

      wrapper.vm.onSelectFileNode({ id: 'README.md' });

      expect(wrapper.vm.activeFileId).toEqual('README.md');
      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf' }, { id: 'README.md' }]);
    });
  });

  describe('Test function: updateFileTabs', () => {
    beforeEach(async () => {
      await wrapper.setProps({
        fileInformations: [
          { path: 'branch.txt' },
          { path: 'terraform/app.tf' },
        ],
      });

      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf' }, { id: 'README.md' }];
    });

    it('should add selected file to fileTabArray and update activeFileId', () => {
      wrapper.vm.activeFileId = 'terraform/app.tf';

      wrapper.vm.updateFileTabs();

      expect(wrapper.vm.activeFileId).toEqual('terraform/app.tf');
      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf', information: { path: 'terraform/app.tf' } }]);
    });

    it('should only update activeFileId if fileTabArray already contains selected file', async () => {
      wrapper.vm.activeFileId = 'README.md';

      wrapper.vm.updateFileTabs();

      expect(wrapper.vm.activeFileId).toEqual('terraform/app.tf');
      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf', information: { path: 'terraform/app.tf' } }]);
      expect(selectFileTabNext).toBeCalled();
    });
  });

  describe('Test watcher: activeFileId', () => {
    it('should be triggered when activeFileId value is updated', async () => {
      wrapper.vm.activeFileId = 'terraform/app.tf';
      wrapper.vm.activeFileId = 'README.md';

      await wrapper.vm.$nextTick();

      expect(selectFileTabNext).toBeCalled();
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to SelectFileNodeEvent', () => {
      expect(selectFileNodeSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to SelectFileNodeEvent', () => {
      expect(selectFileNodeUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(selectFileNodeUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
