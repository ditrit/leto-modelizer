import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount, flushPromises } from '@vue/test-utils';
import ModelizerTextView from 'src/components/ModelizerTextView.vue';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import Project from 'src/composables/Project';
import FileExplorer from 'src/composables/FileExplorer';
import PluginManager from 'src/composables/PluginManager';
import FileStatus from 'src/models/git/FileStatus';

installQuasarPlugin();
const mockFileStatus = new FileStatus({
  path: 'terraform/app.tf', headStatus: 0, workdirStatus: 0, stageStatus: 0,
});

jest.mock('src/composables/Project', () => ({
  getProjectFiles: jest.fn(() => Promise.resolve([{ path: 'terraform/app.tf' }])),
  readProjectFile: jest.fn(() => Promise.resolve({ path: 'terraform/app.tf', content: 'new content' })),
  getStatus: jest.fn(() => Promise.resolve([mockFileStatus])),
  writeProjectFile: jest.fn(),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn([]),
}));

jest.mock('src/composables/FileExplorer', () => ({
  createFile: jest.fn(() => 'createFile'),
  createFolder: jest.fn(() => 'createFolder'),
  sortTreeElements: jest.fn(() => 'sortTreeElements'),
  getTree: jest.fn(() => (
    [{
      id: 'projectName',
      icon: 'fa-solid fa-folder',
      label: 'projectName',
      isFolder: true,
      children: [{
        id: 'terraform',
        icon: 'fa-solid fa-folder',
        label: 'terraform',
        children: [{
          id: 'terraform/app.tf', icon: 'fa-regular fa-file', label: 'app.tf', isFolder: false,
        }],
        isFolder: true,
      }],
    }]
  )),
}));

jest.mock('src/composables/events/FileEvent', () => ({
  OpenFileEvent: {
    subscribe: jest.fn(),
    next: jest.fn(),
  },
  SelectNodeEvent: {
    subscribe: jest.fn(),
  },
  CreateFileEvent: {
    next: jest.fn(),
    subscribe: jest.fn(),
  },
  DeleteFileEvent: {
    subscribe: jest.fn(),
  },
  SelectFileEvent: {
    next: jest.fn(),
  },
  ExpandFolderEvent: {
    next: jest.fn(),
  },
  GlobalSaveFilesEvent: {
    next: jest.fn(),
    subscribe: jest.fn(),
  },
  UpdateFileEvent: {
    next: jest.fn(),
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/events/GitEvent', () => ({
  UpdateRemoteEvent: {
    subscribe: jest.fn(),
  },
  CheckoutEvent: {
    subscribe: jest.fn(),
  },
  PullEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test component: ModelizerTextView', () => {
  let wrapper;
  let openFileSubscribe;
  let openFileUnsubscribe;
  let selectNodeSubscribe;
  let selectNodeUnsubscribe;
  let createFileSubscribe;
  let createFileUnsubscribe;
  let deleteFileSubscribe;
  let deleteFileUnsubscribe;
  let updateRemoteSubscribe;
  let updateRemoteUnsubscribe;
  let checkoutSubscribe;
  let checkoutUnsubscribe;
  let pullSubscribe;
  let pullUnsubscribe;
  let emit;
  let writeProjectFileMock;
  let globalSaveFilesEventSubscribe;
  let globalSaveFilesEventUnsubscribe;
  let updateFileSubscribe;
  let updateFileUnsubscribe;

  beforeEach(() => {
    openFileSubscribe = jest.fn();
    openFileUnsubscribe = jest.fn();
    selectNodeSubscribe = jest.fn();
    selectNodeUnsubscribe = jest.fn();
    createFileSubscribe = jest.fn();
    createFileUnsubscribe = jest.fn();
    deleteFileSubscribe = jest.fn();
    deleteFileUnsubscribe = jest.fn();
    updateRemoteSubscribe = jest.fn();
    updateRemoteUnsubscribe = jest.fn();
    checkoutSubscribe = jest.fn();
    checkoutUnsubscribe = jest.fn();
    writeProjectFileMock = jest.fn();
    pullSubscribe = jest.fn();
    pullUnsubscribe = jest.fn();
    globalSaveFilesEventSubscribe = jest.fn();
    globalSaveFilesEventUnsubscribe = jest.fn();
    updateFileSubscribe = jest.fn();
    updateFileUnsubscribe = jest.fn();

    GitEvent.UpdateRemoteEvent.subscribe.mockImplementation(() => {
      updateRemoteSubscribe();
      return { unsubscribe: updateRemoteUnsubscribe };
    });
    FileEvent.OpenFileEvent.subscribe.mockImplementation(() => {
      openFileSubscribe();
      return { unsubscribe: openFileUnsubscribe };
    });
    FileEvent.SelectNodeEvent.subscribe.mockImplementation(() => {
      selectNodeSubscribe();
      return { unsubscribe: selectNodeUnsubscribe };
    });
    FileEvent.CreateFileEvent.subscribe.mockImplementation(() => {
      createFileSubscribe();
      return { unsubscribe: createFileUnsubscribe };
    });
    FileEvent.DeleteFileEvent.subscribe.mockImplementation(() => {
      deleteFileSubscribe();
      return { unsubscribe: deleteFileUnsubscribe };
    });
    FileEvent.GlobalSaveFilesEvent.subscribe.mockImplementation(() => {
      globalSaveFilesEventSubscribe();
      return { unsubscribe: globalSaveFilesEventUnsubscribe };
    });
    GitEvent.CheckoutEvent.subscribe.mockImplementation(() => {
      checkoutSubscribe();
      return { unsubscribe: checkoutUnsubscribe };
    });
    Project.writeProjectFile.mockImplementation(() => Promise.resolve(writeProjectFileMock()));
    PluginManager.getPlugins.mockImplementation(() => [{
      render: () => [{ path: 'path' }],
    }]);
    GitEvent.PullEvent.subscribe.mockImplementation(() => {
      pullSubscribe();
      return { unsubscribe: pullUnsubscribe };
    });
    FileEvent.UpdateFileEvent.subscribe.mockImplementation(() => {
      updateFileSubscribe();
      return { unsubscribe: updateFileUnsubscribe };
    });

    wrapper = shallowMount(ModelizerTextView, {
      props: {
        projectName: 'project-00000000',
      },
      mocks: {
        FileEvent,
        GitEvent,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });
  });

  describe('Test function: onOpenFileEvent', () => {
    it('should set a new value to activeFileTab', () => {
      wrapper.vm.activeFileTab = { isSelected: false, id: '' };
      wrapper.vm.onOpenFileEvent({ id: 'terraform/app.tf', label: 'app.tf', content: '' });

      expect(wrapper.vm.activeFileTab).toEqual({ isSelected: true, id: 'terraform/app.tf' });
    });

    it('should push the new file to fileTabArray if it is not already there', () => {
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }];
      wrapper.vm.onOpenFileEvent({ id: 'README.md', label: 'README.md', content: '' });

      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf', label: 'app.tf', content: '' }, { id: 'README.md', label: 'README.md', content: '' }]);
    });

    it('should not push the new file to fileTabArray if it is already there', () => {
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }];
      wrapper.vm.onOpenFileEvent({ id: 'terraform/app.tf', label: 'app.tf', content: '' });

      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf', label: 'app.tf', content: '' }]);
    });
  });

  describe('Test function: deleteFileTab', () => {
    beforeEach(() => {
      emit = jest.fn();

      FileEvent.SelectFileEvent.next.mockImplementation(() => emit());
    });

    describe('The file to close is contained within fileTabArray', () => {
      it('should remove file if fileTabArray length is 2 or more', () => {
        wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }, { id: 'README.md', label: 'README.md', content: '' }];
        wrapper.vm.deleteFileTab('terraform/app.tf');

        expect(wrapper.vm.fileTabArray).toEqual([{ id: 'README.md', label: 'README.md', content: '' }]);
      });

      it('should remove file if fileTabArray length is 1', () => {
        wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }];
        wrapper.vm.deleteFileTab('terraform/app.tf');

        expect(wrapper.vm.fileTabArray).toEqual([]);
      });
    });

    describe('Closing the active file, then fileTabArray is empty', () => {
      it('should reset and emit activeFileTab initial value', () => {
        expect(emit).not.toHaveBeenCalled();
        wrapper.vm.fileTabArray = [{ id: 'README.md', label: 'README.md', content: '' }];
        wrapper.vm.activeFileTab = { isSelected: true, id: 'README.md' };
        wrapper.vm.deleteFileTab('README.md');

        expect(wrapper.vm.fileTabArray).toHaveLength(0);
        expect(wrapper.vm.activeFileTab).toEqual({ isSelected: false, id: '' });
        expect(emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('Closing the active file, then fileTabArray is not empty', () => {
      it('should set and emit activeFileTab new value', () => {
        expect(emit).not.toHaveBeenCalled();
        wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }, { id: 'README.md', label: 'README.md', content: '' }];
        wrapper.vm.activeFileTab = { isSelected: true, id: 'README.md' };
        wrapper.vm.deleteFileTab('README.md');

        expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf', label: 'app.tf', content: '' }]);
        expect(wrapper.vm.fileTabArray).toHaveLength(1);
        expect(wrapper.vm.activeFileTab).toEqual({ isSelected: true, id: 'terraform/app.tf' });
        expect(emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('Closing a non active file', () => {
      it('should not set and not emit a new value to activeFileTab', () => {
        wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }, { id: 'README.md', label: 'README.md', content: '' }];
        wrapper.vm.activeFileTab = { isSelected: true, id: 'terraform/app.tf' };
        wrapper.vm.deleteFileTab('README.md');

        expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf', label: 'app.tf', content: '' }]);
        expect(wrapper.vm.fileTabArray).toHaveLength(1);
        expect(wrapper.vm.activeFileTab).toEqual({ isSelected: true, id: 'terraform/app.tf' });
        expect(emit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Test function: updateProjectFiles', () => {
    it('should update nodes when statusResult is truthy', async () => {
      wrapper.vm.nodes = [];

      wrapper.vm.updateProjectFiles();
      await flushPromises();
      expect(wrapper.vm.nodes).toEqual([
        {
          id: 'projectName',
          icon: 'fa-solid fa-folder',
          label: 'projectName',
          isFolder: true,
          children: [
            {
              id: 'terraform',
              icon: 'fa-solid fa-folder',
              label: 'terraform',
              children: [{
                id: 'terraform/app.tf', icon: 'fa-regular fa-file', label: 'app.tf', isFolder: false,
              }],
              isFolder: true,
            },
          ],
        },
      ]);
    });

    it('should updates nodes when statusResult is falsy', async () => {
      Project.getStatus.mockReturnValueOnce([new FileStatus({
        path: 'README.md', headStatus: 0, workdirStatus: 2, stageStatus: 0,
      })]);
      Project.getProjectFiles.mockReturnValueOnce(Promise.resolve([{ path: 'terraform/app.tf' }]));
      FileExplorer.getTree.mockImplementation(jest.fn(() => (
        [{
          id: 'projectName',
          icon: 'fa-solid fa-folder',
          label: 'projectName',
          isFolder: true,
          children: [
            {
              id: 'terraform',
              icon: 'fa-solid fa-folder',
              label: 'terraform',
              children: [{
                id: 'terraform/app.tf', icon: 'fa-regular fa-file', label: 'app.tf', isFolder: false,
              }],
              isFolder: true,
            },
            {
              id: 'README.md', icon: 'fa-regular fa-file', label: 'README.md', isFolder: false,
            },
          ],
        }]
      )));

      wrapper.vm.nodes = [];

      await wrapper.vm.updateProjectFiles();
      await flushPromises();
      expect(wrapper.vm.nodes).toEqual([
        {
          id: 'projectName',
          icon: 'fa-solid fa-folder',
          label: 'projectName',
          isFolder: true,
          children: [
            {
              id: 'terraform',
              icon: 'fa-solid fa-folder',
              label: 'terraform',
              children: [{
                id: 'terraform/app.tf', icon: 'fa-regular fa-file', label: 'app.tf', isFolder: false,
              }],
              isFolder: true,
            },
            {
              id: 'README.md', icon: 'fa-regular fa-file', label: 'README.md', isFolder: false,
            },
          ],
        },
      ]);
    });

    it('should update fileTabArray', async () => {
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf', label: 'app.tf', content: 'content' }];
      wrapper.vm.updateProjectFiles();
      await flushPromises();
      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform/app.tf', content: 'new content', label: 'app.tf' }]);
    });

    it('should update activeFileTab if it is no more contained in updated fileTabArray', async () => {
      wrapper.vm.fileTabArray = [{ id: 'README.md', label: 'README.md', content: 'content' }, { id: 'terraform/app.tf', label: 'app.tf', content: 'content' }];
      wrapper.vm.activeFileTab = { isSelected: true, id: 'README.md' };

      wrapper.vm.updateProjectFiles();
      await flushPromises();
      expect(wrapper.vm.activeFileTab).toEqual({ isSelected: true, id: 'terraform/app.tf' });
    });

    it('should reset activeFileTab if updated fileTabArray is empty', async () => {
      wrapper.vm.fileTabArray = [{ id: 'README.md', label: 'README.md', content: 'content' }];
      wrapper.vm.activeFileTab = { isSelected: true, id: 'README.md' };

      wrapper.vm.updateProjectFiles();
      await flushPromises();
      expect(wrapper.vm.activeFileTab).toEqual({ isSelected: false, id: '' });
    });

    it('should not update activeFileTab if it is still contained in updated fileTabArray', async () => {
      wrapper.vm.fileTabArray = [{ id: 'terraform/app.tf', label: 'app.tf', content: 'other content' }, { id: 'README.md', label: 'README.md', content: 'content' }];
      wrapper.vm.activeFileTab = { isSelected: true, id: 'terraform/app.tf' };

      wrapper.vm.updateProjectFiles();
      await flushPromises();
      expect(wrapper.vm.activeFileTab).toEqual({ isSelected: true, id: 'terraform/app.tf' });
    });
  });

  describe('Test function: updateSelectedNode', () => {
    it('should set selectedNode', () => {
      wrapper.vm.selectedNode = { id: 'test' };
      wrapper.vm.updateSelectedNode({ id: 'test2' });
      wrapper.vm.selectedNode = { id: 'test2' };
    });
  });

  describe('Test function: onCreateFileEvent', () => {
    it('should update activeFileTab, send ExpandFolder and OpenFile events on File', async () => {
      wrapper.vm.activeFileTab = { isSelected: false, id: 'fileName' };
      wrapper.vm.selectedNode = { id: 'nodeName' };

      await wrapper.vm.onCreateFileEvent({ name: 'newFileName', isFolder: false });

      expect(wrapper.vm.activeFileTab).toEqual({ isSelected: true, id: 'terraform/app.tf' });
      expect(FileEvent.ExpandFolderEvent.next).toBeCalled();
      expect(FileEvent.OpenFileEvent.next).toBeCalled();
    });

    it('should update activeFileTab, send ExpandFolder events on Folder', async () => {
      FileEvent.OpenFileEvent.next = jest.fn();
      wrapper.vm.activeFileTab = { isSelected: false, id: 'fileName' };
      wrapper.vm.selectedNode = { id: '' };

      await wrapper.vm.onCreateFileEvent({ name: 'nodeName', isFolder: true });

      expect(FileEvent.ExpandFolderEvent.next).toBeCalled();
      expect(FileEvent.OpenFileEvent.next).not.toBeCalled();
    });
  });

  describe('Test function: onUpdateFile', () => {
    it('should update nodes and fileTabArray if a file content is updated', async () => {
      const mockUpdatedFileStatus = new FileStatus({
        path: 'path', headStatus: 0, workdirStatus: 2, stageStatus: 0,
      });
      const mockUpdatedNodes = [{
        id: 'path',
        icon: 'fa-regular fa-file',
        label: 'path',
        information: mockUpdatedFileStatus,
        isFolder: false,
      }];

      Project.getStatus.mockReturnValueOnce([mockUpdatedFileStatus]);
      FileExplorer.getTree.mockImplementation(jest.fn(() => mockUpdatedNodes));

      wrapper.vm.localFileInformations = [mockUpdatedFileStatus];
      wrapper.vm.fileTabArray = [
        {
          id: 'path',
          label: 'path',
          content: '',
          information: {},
        },
      ];
      wrapper.vm.nodes = [{
        id: 'path',
        icon: 'fa-regular fa-file',
        label: 'path',
        information: {},
        isFolder: false,
      }];

      await wrapper.vm.onUpdateFile('path');

      expect(wrapper.vm.fileTabArray).toEqual([
        {
          id: 'path',
          label: 'path',
          content: '',
          information: mockUpdatedFileStatus,
        },
      ]);
      expect(wrapper.vm.nodes).toEqual(mockUpdatedNodes);
    });

    it('should not update nodes nor fileTabArray if updated file is not found', async () => {
      wrapper.vm.fileTabArray = [{ id: 'terraform' }];
      wrapper.vm.nodes = [{ id: 'terraform' }];
      wrapper.vm.localFileInformations = [{ path: 'terraform' }];

      await wrapper.vm.onUpdateFile('otherPath');

      expect(wrapper.vm.fileTabArray).toEqual([{ id: 'terraform' }]);
      expect(wrapper.vm.nodes).toEqual([{ id: 'terraform' }]);
    });
  });

  describe('Test function: renderPlugins', () => {
    it('should call writeProjectFile once', () => {
      wrapper.vm.renderPlugins();
      expect(writeProjectFileMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to OpenFileEvent', () => {
      expect(openFileSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to UpdateRemoteEvent', () => {
      expect(updateRemoteSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to CheckoutEvent', () => {
      expect(checkoutSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to SelectNodeEvent', () => {
      expect(selectNodeSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to CreateFileEvent', () => {
      expect(createFileSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to DeleteFileEvent', () => {
      expect(deleteFileSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to PullEvent', () => {
      expect(pullSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to UpdateFileEvent', () => {
      expect(updateFileSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to OpenFileEvent', () => {
      expect(openFileUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(openFileUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to UpdateRemoteEvent', () => {
      expect(updateRemoteUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(updateRemoteUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to Checkout', () => {
      expect(checkoutUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(checkoutUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to SelectNodeEvent', () => {
      expect(selectNodeUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(selectNodeUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to CreateFileEvent', () => {
      expect(createFileUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(createFileUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to DeleteNodeEvent', () => {
      expect(deleteFileUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(deleteFileUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to PullEvent', () => {
      expect(pullUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pullUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to UpdateFileEvent', () => {
      expect(updateFileUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(updateFileUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
