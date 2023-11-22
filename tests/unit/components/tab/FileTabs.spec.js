import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import FileTabs from 'src/components/tab/FileTabs.vue';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import * as Project from 'src/composables/Project';
import * as Git from 'src/composables/Git';

installQuasarPlugin();

jest.mock('src/composables/events/FileEvent', () => ({
  RenameFileEvent: {
    subscribe: jest.fn(),
  },
  DeleteFileEvent: {
    subscribe: jest.fn(),
  },
  GlobalUploadFilesEvent: {
    subscribe: jest.fn(),
  },
  SelectFileNodeEvent: {
    subscribe: jest.fn(),
  },
  SelectFileTabEvent: {
    next: jest.fn(),
  },
  UpdateEditorContentEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/events/GitEvent', () => ({
  AddEvent: {
    subscribe: jest.fn(),
  },
  AddRemoteEvent: {
    subscribe: jest.fn(),
  },
  CheckoutEvent: {
    subscribe: jest.fn(),
  },
  CommitEvent: {
    subscribe: jest.fn(),
  },
  PullEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  exists: jest.fn(),
}));

jest.mock('src/composables/Git', () => ({
  getStatus: jest.fn(),
}));

describe('Test component: FileTabs', () => {
  let wrapper;

  // FileEvent
  let renameFileSubscribe;
  let deleteFileSubscribe;
  let globalUploadFilesEventSubscribe;
  let selectFileNodeSubscribe;
  let updateEditorContentSubscribe;

  let renameFileUnsubscribe;
  let deleteFileUnsubscribe;
  let globalUploadFilesEventUnsubscribe;
  let selectFileNodeUnsubscribe;
  let updateEditorContentUnsubscribe;

  let selectFileTabNext;

  // GitEvent
  let addSubscribe;
  let addRemoteSubscribe;
  let checkoutSubscribe;
  let commitFilesSubscribe;
  let pullSubscribe;

  let addUnsubscribe;
  let addRemoteUnsubscribe;
  let checkoutUnsubscribe;
  let commitFilesUnsubscribe;
  let pullUnsubscribe;

  beforeEach(() => {
    // FileEvent
    renameFileSubscribe = jest.fn();
    deleteFileSubscribe = jest.fn();
    globalUploadFilesEventSubscribe = jest.fn();
    selectFileNodeSubscribe = jest.fn();
    updateEditorContentSubscribe = jest.fn();

    renameFileUnsubscribe = jest.fn();
    deleteFileUnsubscribe = jest.fn();
    globalUploadFilesEventUnsubscribe = jest.fn();
    selectFileNodeUnsubscribe = jest.fn();
    updateEditorContentUnsubscribe = jest.fn();

    selectFileTabNext = jest.fn();

    // GitEvent
    addSubscribe = jest.fn();
    addRemoteSubscribe = jest.fn();
    checkoutSubscribe = jest.fn();
    commitFilesSubscribe = jest.fn();
    pullSubscribe = jest.fn();

    addUnsubscribe = jest.fn();
    addRemoteUnsubscribe = jest.fn();
    checkoutUnsubscribe = jest.fn();
    commitFilesUnsubscribe = jest.fn();
    pullUnsubscribe = jest.fn();

    // FileEvent
    FileEvent.RenameFileEvent.subscribe.mockImplementation(() => {
      renameFileSubscribe();
      return { unsubscribe: renameFileUnsubscribe };
    });
    FileEvent.DeleteFileEvent.subscribe.mockImplementation(() => {
      deleteFileSubscribe();
      return { unsubscribe: deleteFileUnsubscribe };
    });
    FileEvent.GlobalUploadFilesEvent.subscribe.mockImplementation(() => {
      globalUploadFilesEventSubscribe();
      return { unsubscribe: globalUploadFilesEventUnsubscribe };
    });
    FileEvent.SelectFileNodeEvent.subscribe.mockImplementation(() => {
      selectFileNodeSubscribe();
      return { unsubscribe: selectFileNodeUnsubscribe };
    });
    FileEvent.UpdateEditorContentEvent.subscribe.mockImplementation(() => {
      updateEditorContentSubscribe();
      return { unsubscribe: updateEditorContentUnsubscribe };
    });

    FileEvent.SelectFileTabEvent.next.mockImplementation(selectFileTabNext);

    // GitEvent
    GitEvent.AddEvent.subscribe.mockImplementation(() => {
      addSubscribe();
      return { unsubscribe: addUnsubscribe };
    });
    GitEvent.AddRemoteEvent.subscribe.mockImplementation(() => {
      addRemoteSubscribe();
      return { unsubscribe: addRemoteUnsubscribe };
    });
    GitEvent.CheckoutEvent.subscribe.mockImplementation(() => {
      checkoutSubscribe();
      return { unsubscribe: checkoutUnsubscribe };
    });
    GitEvent.CommitEvent.subscribe.mockImplementation(() => {
      commitFilesSubscribe();
      return { unsubscribe: commitFilesUnsubscribe };
    });
    GitEvent.PullEvent.subscribe.mockImplementation(() => {
      pullSubscribe();
      return { unsubscribe: pullUnsubscribe };
    });

    wrapper = shallowMount(FileTabs, {
      props: {
        projectName: 'project-00000000',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: projectName', () => {
      it('should match props.projectName', () => {
        expect(wrapper.vm.props.projectName).toEqual('project-00000000');
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

  describe('Test function: onRenameFile', () => {
    it('should remove selected tab and select a new one', () => {
      wrapper.vm.activeFileId = 'terraform/app.tf';
      wrapper.vm.fileTabArray = [
        { id: 'terraform/app.tf' },
        { id: 'README.md' },
      ];

      wrapper.vm.onRenameFile({
        file: {
          id: 'terraform/app.tf',
          isFolder: false,
        },
      });

      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'README.md' }]);
      expect(wrapper.vm.activeFileId).toEqual('README.md');
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

  describe('Test function: onDeleteFile', () => {
    it('should remove file of the deleted folder from fileTabArray', () => {
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf' }, { id: 'README.md' }];

      wrapper.vm.onDeleteFile({
        id: 'terraform',
        isFolder: true,
      });

      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'README.md' }]);
    });

    it('should remove deleted file from fileTabArray', () => {
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf' }, { id: 'README.md' }];

      wrapper.vm.onDeleteFile({ id: 'README.md' });

      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf' }]);
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

  describe('Test function: updateFileStatus', () => {
    it('should do nothing when fileTabArray is empty', async () => {
      wrapper.vm.fileTabArray = [];

      await wrapper.vm.updateFileStatus();

      expect(wrapper.vm.fileTabArray).toEqual([]);
    });

    it('should update fileTab status when fileTabArray is not empty', async () => {
      const information = { path: 'path', key: 'value' };
      wrapper.vm.fileTabArray = [{ id: 'path' }];

      await wrapper.vm.updateFileStatus(information);

      expect(wrapper.vm.fileTabArray[0].information).toEqual(information);
    });
  });

  describe('Test function: updateAllFilesStatus', () => {
    it('should do nothing when fileTabArray is empty', async () => {
      wrapper.vm.fileTabArray = [];
      const getStatus = jest.fn();

      Git.getStatus.mockImplementation(getStatus);

      expect(getStatus).toHaveBeenCalledTimes(0);

      await wrapper.vm.updateAllFilesStatus();

      expect(getStatus).toHaveBeenCalledTimes(0);
    });

    it('should update fileTab status when fileTabArray is not empty', async () => {
      const information = { path: 'path' };

      wrapper.vm.fileTabArray = [{ id: 'path' }];
      const getStatus = jest.fn(() => Promise.resolve([information]));

      Git.getStatus.mockImplementation(getStatus);

      expect(getStatus).toHaveBeenCalledTimes(0);

      await wrapper.vm.updateAllFilesStatus(['path']);

      expect(getStatus).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.fileTabArray[0].information).toEqual(information);
    });
  });

  describe('Test function: updateAllFileTabs', () => {
    it('should update fileTabArray', async () => {
      wrapper.vm.fileTabArray = [
        { id: 'path' },
        { id: 'wrongPath' },
      ];

      Project.exists.mockImplementation((path) => {
        if (path === `${wrapper.vm.props.projectName}/path`) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });

      await wrapper.vm.updateAllFileTabs();

      expect(wrapper.vm.fileTabArray.length).toEqual(1);
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
    // FileEvent
    it('should subscribe to RenameFileEvent', () => {
      expect(renameFileSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to DeleteFileEvent', () => {
      expect(deleteFileSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to GlobalUploadFilesEvent', () => {
      expect(globalUploadFilesEventSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to SelectFileNodeEvent', () => {
      expect(selectFileNodeSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to UpdateEditorContentEvent', () => {
      expect(updateEditorContentSubscribe).toHaveBeenCalledTimes(1);
    });

    // GitEvent
    it('should subscribe to AddEvent', () => {
      expect(addSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to AddRemoteEvent', () => {
      expect(addRemoteSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to CheckoutEvent', () => {
      expect(checkoutSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to CommitEvent', () => {
      expect(commitFilesSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to PullEvent', () => {
      expect(pullSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    // FileEvent
    it('should unsubscribe to RenameFileEvent', () => {
      expect(renameFileUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(renameFileUnsubscribe).toHaveBeenCalledTimes(1);
    });
    it('should unsubscribe to DeleteFileEvent', () => {
      expect(deleteFileUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(deleteFileUnsubscribe).toHaveBeenCalledTimes(1);
    });
    it('should unsubscribe to GlobalUploadFilesEvent', () => {
      expect(globalUploadFilesEventUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(globalUploadFilesEventUnsubscribe).toHaveBeenCalledTimes(1);
    });
    it('should unsubscribe to SelectFileNodeEvent', () => {
      expect(selectFileNodeUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(selectFileNodeUnsubscribe).toHaveBeenCalledTimes(1);
    });
    it('should unsubscribe to UpdateEditorContentEvent', () => {
      expect(updateEditorContentUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(updateEditorContentUnsubscribe).toHaveBeenCalledTimes(1);
    });

    // GitEvent
    it('should unsubscribe to AddEvent', () => {
      expect(addUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(addUnsubscribe).toHaveBeenCalledTimes(1);
    });
    it('should unsubscribe to AddRemoteEvent', () => {
      expect(addRemoteUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(addRemoteUnsubscribe).toHaveBeenCalledTimes(1);
    });
    it('should unsubscribe to CheckoutEvent', () => {
      expect(checkoutUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(checkoutUnsubscribe).toHaveBeenCalledTimes(1);
    });
    it('should unsubscribe to CommitEvent', () => {
      expect(commitFilesUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(commitFilesUnsubscribe).toHaveBeenCalledTimes(1);
    });
    it('should unsubscribe to PullEvent', () => {
      expect(pullUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pullUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
