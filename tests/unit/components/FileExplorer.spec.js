import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import FileExplorer from 'src/components/FileExplorer.vue';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import * as Project from 'src/composables/Project';
import * as PluginManager from 'src/composables/PluginManager';

installQuasarPlugin();

jest.mock('src/composables/Project', () => ({
  getProjectFiles: jest.fn(() => Promise.resolve([])),
  getStatus: jest.fn(() => Promise.resolve([])),
  isDirectory: jest.fn((file) => Promise.resolve(file === 'folder')),
}));

jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({
    query: { path: 'pluginName/modelName' },
  })),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: jest.fn(),
}));

jest.mock('src/composables/FileExplorer', () => ({
  getTree: jest.fn(() => (
    [{
      id: 'projectName',
      label: 'projectName',
      isFolder: true,
      children: [{
        id: 'terraform',
        label: 'terraform',
        isFolder: true,
        children: [{
          id: 'terraform/app.tf',
          label: 'app.tf',
          isFolder: false,
        }],
      }],
    }]
  )),
  updateFileInformation: jest.fn(),
}));

jest.mock('src/composables/events/FileEvent', () => ({
  CreateFileEvent: {
    subscribe: jest.fn(),
  },
  RenameFileEvent: {
    subscribe: jest.fn(),
  },
  CreateFileNodeEvent: {
    subscribe: jest.fn(),
  },
  DeleteFileEvent: {
    subscribe: jest.fn(),
  },
  GlobalUploadFilesEvent: {
    subscribe: jest.fn(),
  },
  SelectFileNodeEvent: {
    next: jest.fn(),
  },
  SelectFileTabEvent: {
    next: jest.fn(),
    subscribe: jest.fn(),
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

describe('Test component: FileExplorer', () => {
  let wrapper;

  // FileEvent
  let createFileEventSubscribe;
  let renameFileEventSubscribe;
  let createFileNodeEventSubscribe;
  let deleteFileSubscribe;
  let globalUploadFilesEventSubscribe;
  let selectFileTabEventSubscribe;
  let updateEditorContentSubscribe;

  let createFileEventUnsubscribe;
  let renameFileEventUnsubscribe;
  let createFileNodeEventUnsubscribe;
  let deleteFileUnsubscribe;
  let globalUploadFilesEventUnsubscribe;
  let selectFileTabEventUnsubscribe;
  let updateEditorContentUnsubscribe;

  let selectFileNodeEventNext;
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
    createFileEventSubscribe = jest.fn();
    renameFileEventSubscribe = jest.fn();
    createFileNodeEventSubscribe = jest.fn();
    deleteFileSubscribe = jest.fn();
    globalUploadFilesEventSubscribe = jest.fn();
    selectFileTabEventSubscribe = jest.fn();
    updateEditorContentSubscribe = jest.fn();

    createFileEventUnsubscribe = jest.fn();
    renameFileEventUnsubscribe = jest.fn();
    createFileNodeEventUnsubscribe = jest.fn();
    deleteFileUnsubscribe = jest.fn();
    globalUploadFilesEventUnsubscribe = jest.fn();
    selectFileTabEventUnsubscribe = jest.fn();
    updateEditorContentUnsubscribe = jest.fn();

    selectFileNodeEventNext = jest.fn();
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
    FileEvent.CreateFileEvent.subscribe.mockImplementation(() => {
      createFileEventSubscribe();
      return { unsubscribe: createFileEventUnsubscribe };
    });
    FileEvent.RenameFileEvent.subscribe.mockImplementation(() => {
      renameFileEventSubscribe();
      return { unsubscribe: renameFileEventUnsubscribe };
    });
    FileEvent.CreateFileNodeEvent.subscribe.mockImplementation(() => {
      createFileNodeEventSubscribe();
      return { unsubscribe: createFileNodeEventUnsubscribe };
    });
    FileEvent.DeleteFileEvent.subscribe.mockImplementation(() => {
      deleteFileSubscribe();
      return { unsubscribe: deleteFileUnsubscribe };
    });
    FileEvent.GlobalUploadFilesEvent.subscribe.mockImplementation(() => {
      globalUploadFilesEventSubscribe();
      return { unsubscribe: globalUploadFilesEventUnsubscribe };
    });
    FileEvent.SelectFileTabEvent.subscribe.mockImplementation(() => {
      selectFileTabEventSubscribe();
      return { unsubscribe: selectFileTabEventUnsubscribe };
    });
    FileEvent.UpdateEditorContentEvent.subscribe.mockImplementation(() => {
      updateEditorContentSubscribe();
      return { unsubscribe: updateEditorContentUnsubscribe };
    });

    FileEvent.SelectFileNodeEvent.next.mockImplementation(selectFileNodeEventNext);
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

    wrapper = shallowMount(FileExplorer, {
      global: {
        plugins: [
          createI18n({
            locale: 'en-US',
            messages: i18nConfiguration,
          }),
        ],
      },
      props: {
        projectName: 'project-00000000',
        showParsableFiles: false,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.props.projectName).toEqual('project-00000000');
      });
    });

    describe('Test prop: showParsableFiles', () => {
      it('should be false', () => {
        expect(wrapper.vm.props.showParsableFiles).toEqual(false);
      });
    });

    describe('Test variable: nodes', () => {
      it('should be an empty array', () => {
        expect(wrapper.vm.nodes).toEqual([{
          id: 'projectName',
          label: 'projectName',
          isFolder: true,
          children: [{
            id: 'terraform',
            label: 'terraform',
            isFolder: true,
            children: [{
              id: 'terraform/app.tf',
              label: 'app.tf',
              isFolder: false,
            }],
          }],
        }]);
      });
    });

    describe('Test variable: activeFileId', () => {
      it('should be null', () => {
        expect(wrapper.vm.activeFileId).toEqual(null);
      });
    });

    describe('Test variable: filterTrigger', () => {
      it('should match "false"', () => {
        expect(wrapper.vm.filterTrigger).toEqual('false');
      });
    });
  });

  describe('Test function: filterParsableFiles', () => {
    it('should return true if props.showParsableFiles is false', () => {
      const result = wrapper.vm.filterParsableFiles({ isFolder: false, isParsable: false });

      expect(result).toEqual(true);
    });

    it('should return true if isParsable is true', async () => {
      await wrapper.setProps({
        showParsableFiles: true,
      });

      const result = wrapper.vm.filterParsableFiles({ isFolder: false, isParsable: true });

      expect(result).toEqual(true);
    });

    it('should return true if isFolder is true', async () => {
      await wrapper.setProps({
        showParsableFiles: true,
      });

      const result = wrapper.vm.filterParsableFiles({ isFolder: true, isParsable: false });

      expect(result).toEqual(true);
    });

    it('should return false if isFolder and isParsable are false', async () => {
      await wrapper.setProps({
        showParsableFiles: true,
      });

      const result = wrapper.vm.filterParsableFiles({ isFolder: false, isParsable: false });

      expect(result).toEqual(false);
    });
  });

  describe('Test function: isFolderWithoutParsableFiles', () => {
    it('should return false if isFolder is false', () => {
      const result = wrapper.vm.isFolderWithoutParsableFiles(
        {
          isFolder: false,
          isRootFolder: false,
          hasParsableFiles: false,
        },
      );

      expect(result).toEqual(false);
    });

    it('should return false if isRootFolder is true', () => {
      const result = wrapper.vm.isFolderWithoutParsableFiles(
        {
          isFolder: true,
          isRootFolder: true,
          hasParsableFiles: false,
        },
      );

      expect(result).toEqual(false);
    });

    it('should return false if hasParsableFiles is true', () => {
      const result = wrapper.vm.isFolderWithoutParsableFiles(
        {
          isFolder: true,
          isRootFolder: false,
          hasParsableFiles: true,
        },
      );

      expect(result).toEqual(false);
    });

    it('should return true if isFolder is true, isRootFolder and hasParsableFiles are false', () => {
      const result = wrapper.vm.isFolderWithoutParsableFiles(
        {
          isFolder: true,
          isRootFolder: false,
          hasParsableFiles: false,
        },
      );

      expect(result).toEqual(true);
    });
  });

  describe('Test function: onCreateFileNode', () => {
    it('should call setExpanded', () => {
      wrapper.vm.fileExplorerRef = {
        getNodeByKey: jest.fn(() => true),
        isExpanded: jest.fn(() => true),
        setExpanded: jest.fn(),
      };
      wrapper.vm.onCreateFileNode({ parentNodeId: {}, node: {}, isFolder: true });

      expect(wrapper.vm.fileExplorerRef.setExpanded).toBeCalled();
    });

    it('should update activeFileId and send SelectFileNode event if node created is a file', () => {
      wrapper.vm.fileExplorerRef = {
        getNodeByKey: jest.fn(() => true),
        isExpanded: jest.fn(() => true),
        setExpanded: jest.fn(),
      };
      wrapper.vm.onCreateFileNode({ parentNodeId: {}, node: { id: 'newFile.js' }, isFolder: false });

      expect(wrapper.vm.activeFileId).toEqual('newFile.js');
      expect(selectFileNodeEventNext).toBeCalled();
    });
  });

  describe('Test function: onCreateFile', () => {
    it('should add an "__empty__" file when isFolder is true', async () => {
      const folder = {
        name: 'folderName',
        isFolder: true,
        path: 'folderName',
      };
      wrapper.vm.fileExplorerRef = {
        getNodeByKey: jest.fn(() => true),
        isExpanded: jest.fn(() => true),
        setExpanded: jest.fn(),
      };
      wrapper.vm.localFileInformations = [];

      await wrapper.vm.onCreateFile(folder);

      expect(wrapper.vm.localFileInformations[0]).toEqual(expect.objectContaining({ path: 'folderName/__empty__' }));
    });

    it('should add a file otherwise', async () => {
      const file = {
        name: 'fileName',
        isFolder: false,
        path: 'fileName',
      };
      wrapper.vm.fileExplorerRef = {
        getNodeByKey: jest.fn(() => true),
        isExpanded: jest.fn(() => true),
        setExpanded: jest.fn(),
      };
      wrapper.vm.localFileInformations = [];
      Project.getStatus.mockImplementation(() => [{ path: 'fileName' }]);

      await wrapper.vm.onCreateFile(file);

      expect(wrapper.vm.localFileInformations[0]).toEqual(expect.objectContaining({ path: 'fileName' }));
    });
  });

  describe('Test function: onDeleteFile', () => {
    it('should update delete the file and leave an __empty__ file', () => {
      const file = {
        id: 'fileName',
        isFolder: false,
      };
      wrapper.vm.localFileInformations = [{
        path: 'fileName',
      }];

      wrapper.vm.onDeleteFile(file);

      expect(wrapper.vm.localFileInformations[0]).toEqual(expect.objectContaining({ path: '__empty__' }));
    });
  });

  describe('Test function: updateFileStatus', () => {
    it('should update localFileInformations status', async () => {
      wrapper.vm.localFileInformations = [{
        path: 'fileName',
        status: 'status',
      }];

      await wrapper.vm.updateFileStatus({ path: 'fileName', status: 'newStatus' });

      expect(wrapper.vm.localFileInformations[0]).toEqual(expect.objectContaining({ path: 'fileName', status: 'newStatus' }));
    });

    it('should do nothing if corresponding file status has not changed', async () => {
      wrapper.vm.localFileInformations = [{
        path: 'fileName',
        status: 'status',
      }];

      await wrapper.vm.updateFileStatus({ path: 'fileName', status: 'status' });

      expect(wrapper.vm.localFileInformations[0]).toEqual(expect.objectContaining({ path: 'fileName', status: 'status' }));
    });
  });

  describe('Test function: onNodeDoubleClicked', () => {
    it('should not update activeFileId nor send SelectFileNode event when isFolder is true', async () => {
      await wrapper.vm.onNodeDoubleClicked({ isFolder: true });

      expect(wrapper.vm.activeFileId).toEqual(null);
      expect(selectFileNodeEventNext).not.toBeCalled();
    });

    it('should update activeFileId and send SelectFileNode event when isFolder is false', async () => {
      await wrapper.vm.onNodeDoubleClicked({ id: 'terraform/app.tf', isFolder: false });

      expect(wrapper.vm.activeFileId).toEqual('terraform/app.tf');
      expect(selectFileNodeEventNext).toBeCalled();
    });
  });

  describe('Test function: expandFolder', () => {
    it('should call fileExplorerRef.setExpanded() when folder tree node exists', () => {
      wrapper.vm.fileExplorerRef = {
        getNodeByKey: jest.fn(() => ({ children: [] })),
        setExpanded: jest.fn(),
      };

      wrapper.vm.expandFolder('foder');

      expect(wrapper.vm.fileExplorerRef.setExpanded).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: openFile', () => {
    it('should update activeFileId & send SelectFileNodeEvent when file tree node exists', () => {
      wrapper.vm.activeFileId = null;
      wrapper.vm.fileExplorerRef = {
        getNodeByKey: jest.fn(() => ({ id: 'fileId' })),
      };

      expect(selectFileNodeEventNext).toHaveBeenCalledTimes(0);

      wrapper.vm.openFile('file');

      expect(wrapper.vm.activeFileId).toEqual('fileId');
      expect(selectFileNodeEventNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: openModelFiles', () => {
    it('should do nothing without plugin', async () => {
      const mock = jest.fn(() => ({
        isParsable: () => true,
        configuration: {
          isFolderTypeDiagram: false,
        },
      }));

      PluginManager.getPluginByName.mockImplementation(mock);

      wrapper.vm.fileExplorerRef = {
        getNodeByKey: jest.fn(() => ({ children: [] })),
        setExpanded: jest.fn(),
      };
      wrapper.vm.query.path = 'pluginName/modelName';
      wrapper.vm.query.plugin = '';
      wrapper.vm.localFileInformations = [{ path: 'pluginName/modelName/file.ext' }];

      await wrapper.vm.openModelFiles();

      expect(mock).toHaveBeenCalledTimes(0);
    });

    it('should call getPluginByName()', async () => {
      const mock = jest.fn(() => ({
        isParsable: () => true,
        configuration: {
          isFolderTypeDiagram: true,
        },
      }));

      PluginManager.getPluginByName.mockImplementation(mock);

      wrapper.vm.fileExplorerRef = {
        getNodeByKey: jest.fn(() => ({ children: [] })),
        setExpanded: jest.fn(),
      };
      wrapper.vm.query.path = 'folder';
      wrapper.vm.query.plugin = 'test';
      wrapper.vm.localFileInformations = [{ path: 'folder/modelName/file.ext' }];

      await wrapper.vm.openModelFiles();

      expect(mock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: initTreeNodes', () => {
    it('should update nodes', () => {
      wrapper.vm.fileExplorerRef.getNodeByKey = () => null;
      wrapper.vm.query.path = 'pluginName/modelNamecoucou';
      wrapper.vm.query.plugin = 'test';

      wrapper.vm.initTreeNodes();

      expect(wrapper.vm.nodes).toEqual([{
        id: 'projectName',
        label: 'projectName',
        isFolder: true,
        children: [{
          id: 'terraform',
          label: 'terraform',
          isFolder: true,
          children: [{
            id: 'terraform/app.tf',
            label: 'app.tf',
            isFolder: false,
          }],
        }],
      }]);
    });
  });

  describe('Test hook function: onMounted', () => {
    // FileEvent
    it('should subscribe to CreateFileEvent', () => {
      expect(createFileEventSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to RenameFileEvent', () => {
      expect(renameFileEventSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to DeleteFileEvent', () => {
      expect(deleteFileSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to GlobalUploadFilesEvent', () => {
      expect(globalUploadFilesEventSubscribe).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to SelectFileTabEvent', () => {
      expect(selectFileTabEventSubscribe).toHaveBeenCalledTimes(1);
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
    it('should unsubscribe to CreateFileEvent', () => {
      expect(createFileEventUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(createFileEventUnsubscribe).toHaveBeenCalledTimes(1);
    });
    it('should unsubscribe to RenameFileEvent', () => {
      expect(renameFileEventUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(renameFileEventUnsubscribe).toHaveBeenCalledTimes(1);
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
    it('should unsubscribe to SelectFileTabEvent', () => {
      expect(selectFileTabEventUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(selectFileTabEventUnsubscribe).toHaveBeenCalledTimes(1);
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
