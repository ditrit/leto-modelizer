import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerTextView from 'src/components/ModelizerTextView.vue';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import Project from 'src/composables/Project';
import PluginManager from 'src/composables/PluginManager';
import FileStatus from 'src/models/git/FileStatus';
import { FileInformation } from 'leto-modelizer-plugin-core';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { useRoute, useRouter } from 'vue-router';

installQuasarPlugin();
const mockFileStatus = new FileStatus({
  path: 'terraform/app.tf', headStatus: 0, workdirStatus: 0, stageStatus: 0,
});

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  getProjectFiles: jest.fn(() => Promise.resolve([{ path: 'terraform/app.tf' }])),
  getStatus: jest.fn(() => Promise.resolve([mockFileStatus])),
  writeProjectFile: jest.fn(),
  getAllModels: jest.fn(),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(() => [{
    data: {
      name: 'test',
    },
  }]),
  renderPlugin: jest.fn([]),
  getPluginByName: jest.fn(),
  renderModel: jest.fn(),
}));

jest.mock('src/composables/events/FileEvent', () => ({
  GlobalUploadFilesEvent: {
    subscribe: jest.fn(),
  },
  CreateFileEvent: {
    subscribe: jest.fn(),
  },
  DeleteFileEvent: {
    subscribe: jest.fn(),
  },
  UpdateEditorContentEvent: {
    subscribe: jest.fn(),
  },
  CreateFileNodeEvent: {
    next: jest.fn(),
  },
  UpdateFileContentEvent: {
    next: jest.fn(),
  },
  SelectFileTabEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/events/GitEvent', () => ({
  AddRemoteEvent: {
    subscribe: jest.fn(),
  },
  CheckoutEvent: {
    subscribe: jest.fn(),
  },
  PullEvent: {
    subscribe: jest.fn(),
  },
  PushEvent: {
    subscribe: jest.fn(),
  },
  AddEvent: {
    subscribe: jest.fn(),
  },
  CommitEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/events/ViewSwitchEvent', () => ({
  subscribe: jest.fn(),
}));

describe('Test component: ModelizerTextView', () => {
  let wrapper;
  let addRemoteSubscribe;
  let addRemoteUnsubscribe;
  let checkoutSubscribe;
  let checkoutUnsubscribe;
  let pullSubscribe;
  let pullUnsubscribe;
  let pushSubscribe;
  let pushUnsubscribe;
  let addSubscribe;
  let addUnsubscribe;
  let commitSubscribe;
  let commitUnsubscribe;
  let globalUploadFilesSubscribe;
  let globalUploadFilesUnsubscribe;
  let createFileSubscribe;
  let createFileUnsubscribe;
  let deleteFileSubscribe;
  let deleteFileUnsubscribe;
  let updateEditorContentSubscribe;
  let updateEditorContentUnsubscribe;
  let viewSwitchSubscribe;
  let viewSwitchUnsubscribe;
  let createFileNodeNext;
  let updateFileContentNext;
  let writeProjectFileMock;
  let selectFileTabEventSubscribe;
  let selectFileTabEventUnsubscribe;
  let useRouterPush;
  let renderMock;

  beforeEach(() => {
    addRemoteSubscribe = jest.fn();
    addRemoteUnsubscribe = jest.fn();
    checkoutSubscribe = jest.fn();
    checkoutUnsubscribe = jest.fn();
    writeProjectFileMock = jest.fn();
    pullSubscribe = jest.fn();
    pullUnsubscribe = jest.fn();
    pushSubscribe = jest.fn();
    pushUnsubscribe = jest.fn();
    addSubscribe = jest.fn();
    addUnsubscribe = jest.fn();
    commitSubscribe = jest.fn();
    commitUnsubscribe = jest.fn();
    globalUploadFilesSubscribe = jest.fn();
    globalUploadFilesUnsubscribe = jest.fn();
    createFileSubscribe = jest.fn();
    createFileUnsubscribe = jest.fn();
    deleteFileSubscribe = jest.fn();
    deleteFileUnsubscribe = jest.fn();
    updateEditorContentSubscribe = jest.fn();
    updateEditorContentUnsubscribe = jest.fn();
    viewSwitchSubscribe = jest.fn();
    viewSwitchUnsubscribe = jest.fn();
    createFileNodeNext = jest.fn();
    updateFileContentNext = jest.fn();
    selectFileTabEventSubscribe = jest.fn();
    selectFileTabEventUnsubscribe = jest.fn();
    useRouterPush = jest.fn();
    renderMock = jest.fn();

    useRoute.mockImplementation(() => ({ query: { path: 'coucou' } }));
    useRouter.mockImplementation(() => ({
      push: useRouterPush,
    }));

    GitEvent.AddRemoteEvent.subscribe.mockImplementation(() => {
      addRemoteSubscribe();
      return { unsubscribe: addRemoteUnsubscribe };
    });
    GitEvent.CheckoutEvent.subscribe.mockImplementation(() => {
      checkoutSubscribe();
      return { unsubscribe: checkoutUnsubscribe };
    });
    GitEvent.PullEvent.subscribe.mockImplementation(() => {
      pullSubscribe();
      return { unsubscribe: pullUnsubscribe };
    });
    GitEvent.PushEvent.subscribe.mockImplementation(() => {
      pushSubscribe();
      return { unsubscribe: pushUnsubscribe };
    });
    GitEvent.AddEvent.subscribe.mockImplementation(() => {
      addSubscribe();
      return { unsubscribe: addUnsubscribe };
    });
    GitEvent.CommitEvent.subscribe.mockImplementation(() => {
      commitSubscribe();
      return { unsubscribe: commitUnsubscribe };
    });

    FileEvent.GlobalUploadFilesEvent.subscribe.mockImplementation(() => {
      globalUploadFilesSubscribe();
      return { unsubscribe: globalUploadFilesUnsubscribe };
    });
    FileEvent.CreateFileEvent.subscribe.mockImplementation(() => {
      createFileSubscribe();
      return { unsubscribe: createFileUnsubscribe };
    });
    FileEvent.DeleteFileEvent.subscribe.mockImplementation(() => {
      deleteFileSubscribe();
      return { unsubscribe: deleteFileUnsubscribe };
    });
    FileEvent.UpdateEditorContentEvent.subscribe.mockImplementation(() => {
      updateEditorContentSubscribe();
      return { unsubscribe: updateEditorContentUnsubscribe };
    });
    FileEvent.SelectFileTabEvent.subscribe.mockImplementation(() => {
      selectFileTabEventSubscribe();
      return { unsubscribe: selectFileTabEventUnsubscribe };
    });
    FileEvent.CreateFileNodeEvent.next.mockImplementation(createFileNodeNext);
    FileEvent.UpdateFileContentEvent.next.mockImplementation(updateFileContentNext);

    ViewSwitchEvent.subscribe.mockImplementation(() => {
      viewSwitchSubscribe();
      return { unsubscribe: viewSwitchUnsubscribe };
    });

    Project.writeProjectFile.mockImplementation(() => Promise.resolve(writeProjectFileMock()));
    Project.getAllModels.mockImplementation(() => [{
      plugin: 'plugin',
      name: 'name',
    }]);

    PluginManager.getPlugins.mockImplementation(() => [{
      render: () => [{ path: 'path' }],
      data: {
        name: 'test',
      },
    }]);
    PluginManager.renderPlugin.mockImplementation(() => Promise.resolve([
      new FileInformation({
        path: 'leto-modelizer.config.json',
      }),
      new FileInformation({
        path: 'test.json',
      }),
    ]));
    PluginManager.getPluginByName.mockImplementation(() => Promise.resolve({}));
    PluginManager.renderModel.mockImplementation(() => {
      renderMock();
      return Promise.resolve([
        { path: 'createdFile' },
        { path: 'updatedFile' },
      ]);
    });

    wrapper = shallowMount(ModelizerTextView, {
      props: {
        projectName: 'project-00000000',
      },
      mocks: {
        FileEvent,
        GitEvent,
      },
      global: {
        plugins: [
          createI18n({
            locale: 'en-US',
            messages: i18nConfiguration,
          }),
        ],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });

    describe('Test variable: showParsableFiles', () => {
      it('should be false', () => {
        expect(wrapper.vm.showParsableFiles).toEqual(false);
      });
    });
  });

  describe('Test function: updateProjectFiles', () => {
    it('should update localFileInformations', async () => {
      await wrapper.vm.updateProjectFiles();

      expect(wrapper.vm.localFileInformations).toEqual([mockFileStatus]);
    });
  });

  describe('Test function: updateFileStatus', () => {
    it('should update the status of the given file and update localFileInformations accordingly', async () => {
      const mockUpdatedFileStatus = new FileStatus({
        path: 'terraform/app.tf', headStatus: 0, workdirStatus: 2, stageStatus: 3,
      });

      Project.getStatus.mockReturnValueOnce(Promise.resolve([mockUpdatedFileStatus]));

      await wrapper.vm.updateFileStatus('terraform/app.tf');

      expect(wrapper.vm.localFileInformations).toEqual([mockUpdatedFileStatus]);
    });

    it('should update the status of the added file and update localFileInformations accordingly', async () => {
      const mockUpdatedFileStatus = new FileStatus({
        path: 'terraform/app.tf', headStatus: 0, workdirStatus: 2, stageStatus: 2,
      });

      Project.getStatus.mockReturnValueOnce(Promise.resolve([mockUpdatedFileStatus]));

      await wrapper.vm.updateFileStatus('terraform/app.tf');

      expect(wrapper.vm.localFileInformations).toEqual([mockUpdatedFileStatus]);
    });
  });

  describe('Test function: updateAllFilesStatus', () => {
    it('should get the status of all project files and update localFileInformations', async () => {
      const mockUpdatedFileStatus = new FileStatus({
        path: 'terraform/app.tf', headStatus: 0, workdirStatus: 2, stageStatus: 0,
      });
      const notUpdatedFileStatus = new FileStatus({
        path: 'leto-modelizer.config.json',
      });
      wrapper.vm.localFileInformations.push(notUpdatedFileStatus);

      Project.getStatus.mockReturnValueOnce(Promise.resolve([mockUpdatedFileStatus]));

      await wrapper.vm.updateAllFilesStatus();

      expect(wrapper.vm.localFileInformations).toEqual(
        [mockUpdatedFileStatus, notUpdatedFileStatus],
      );
    });
  });

  describe('Test function: onCommitFiles', () => {
    it('should update the status of the committed files and update localFileInformations accordingly', async () => {
      const mockUpdatedFileStatus = new FileStatus({
        path: 'terraform/app.tf', headStatus: 1, workdirStatus: 0, stageStatus: 0,
      });
      const notUpdatedFileStatus = new FileStatus({
        path: 'leto-modelizer.config.json',
      });
      wrapper.vm.localFileInformations.push(notUpdatedFileStatus);

      Project.getStatus.mockReturnValueOnce(Promise.resolve([mockUpdatedFileStatus]));

      await wrapper.vm.onCommitFiles(['terraform/app.tf']);

      expect(wrapper.vm.localFileInformations).toEqual(
        [mockUpdatedFileStatus, notUpdatedFileStatus],
      );
    });
  });

  describe('Test function: onCreateFile', () => {
    it('should add created file with its new status to localFileInformations and send CreateFileNode event', async () => {
      const mockNewFileStatus = new FileStatus({
        path: 'terraform/newFile.js', headStatus: 0, workdirStatus: 2, stageStatus: 0,
      });

      Project.getStatus.mockReturnValueOnce(Promise.resolve([mockNewFileStatus]));

      await wrapper.vm.onCreateFile({ name: 'newFile.js', isFolder: false, path: 'terraform/newFile.js' });

      expect(wrapper.vm.localFileInformations).toEqual([mockFileStatus, mockNewFileStatus]);
      expect(createFileNodeNext).toBeCalled();
    });

    it('should add created folder to localFileInformations and send CreateFileNode event', () => {
      const newFolder = new FileInformation({ path: 'newFolder/__empty__' });

      wrapper.vm.onCreateFile({ name: 'newFolder', isFolder: true, path: 'newFolder' });

      expect(wrapper.vm.localFileInformations).toEqual([mockFileStatus, newFolder]);
      expect(createFileNodeNext).toBeCalled();
    });
  });

  describe('Test function: onDeleteFile', () => {
    it('should delete last file of a folder', () => {
      wrapper.vm.localFileInformations = [
        { path: 'terraform/app.tf' },
      ];

      wrapper.vm.onDeleteFile({ id: 'terraform/app.tf', isFolder: false });

      expect(wrapper.vm.localFileInformations).toEqual([{ path: 'terraform/__empty__' }]);
    });

    it('should delete empty folder', () => {
      wrapper.vm.localFileInformations = [
        { path: 'terraform/__empty__' },
        { path: 'rootFile.js' },
      ];

      wrapper.vm.onDeleteFile({ id: 'terraform', isFolder: true });

      expect(wrapper.vm.localFileInformations).toEqual([{ path: 'rootFile.js' }]);
    });

    it('should delete filled folder', () => {
      wrapper.vm.localFileInformations = [
        { path: 'terraform/app.tf' },
        { path: 'rootFile.js' },
      ];

      wrapper.vm.onDeleteFile({ id: 'terraform', isFolder: true });

      expect(wrapper.vm.localFileInformations).toEqual([{ path: 'rootFile.js' }]);
    });
  });

  describe('Test function: renderPluginFiles', () => {
    it('should call renderModel()', async () => {
      process.env.MODELS_DEFAULT_FOLDER = 'test';

      await wrapper.vm.renderPluginFiles();

      expect(renderMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: getModel', () => {
    it('should return model corresponding to the selected file', async () => {
      process.env.MODELS_DEFAULT_FOLDER = '';
      wrapper.vm.selectedFileTabPath = 'plugin/name/filename';
      const model = await wrapper.vm.getModel();

      expect(model).toEqual({
        plugin: 'plugin',
        name: 'name',
      });
    });

    it('should return undefined if MODELS_DEFAULT_FOLDER is defined', async () => {
      process.env.MODELS_DEFAULT_FOLDER = 'test';
      wrapper.vm.selectedFileTabPath = 'plugin/name/filename';
      const model = await wrapper.vm.getModel();

      expect(model).toEqual(undefined);
    });

    it('should return undefined otherwise', async () => {
      wrapper.vm.selectedFileTabPath = null;
      const model = await wrapper.vm.getModel();

      expect(model).toEqual(undefined);
    });
  });

  describe('Test function: onSwitchView', () => {
    it('should do nothing if param is not equal to "text"', async () => {
      await wrapper.vm.onSwitchView('model');

      expect(createFileNodeNext).not.toBeCalled();
      expect(updateFileContentNext).not.toBeCalled();
    });

    it('should send CreateFileNode & UpdateFileContent event otherwise', async () => {
      wrapper.vm.localFileInformations = [new FileInformation({
        path: 'updatedFile',
      })];

      await wrapper.vm.onSwitchView('text');

      expect(createFileNodeNext).toBeCalled();
      expect(updateFileContentNext).toBeCalled();
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to AddRemoteEvent', () => {
      expect(addRemoteSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to CheckoutEvent', () => {
      expect(checkoutSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to PullEvent', () => {
      expect(pullSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to PushEvent', () => {
      expect(pushSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to AddEvent', () => {
      expect(addSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to CommitEvent', () => {
      expect(commitSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to GlobalUploadFilesEvent', () => {
      expect(globalUploadFilesSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to CreateFileEvent', () => {
      expect(createFileSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to DeleteFileEvent', () => {
      expect(deleteFileSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to UpdateEditorContentEvent', () => {
      expect(updateEditorContentSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to ViewSwitchEvent', () => {
      expect(viewSwitchSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
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

    it('should unsubscribe to PullEvent', () => {
      expect(pullUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pullUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to PushEvent', () => {
      expect(pushUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pushUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to AddEvent', () => {
      expect(addUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(addUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to CommitEvent', () => {
      expect(commitUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(commitUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to GlobalUploadFilesEvent', () => {
      expect(globalUploadFilesUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(globalUploadFilesUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to CreateFileEvent', () => {
      expect(createFileUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(createFileUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to DeleteFileEvent', () => {
      expect(deleteFileUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(deleteFileUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to UpdateEditorContentEvent', () => {
      expect(updateEditorContentUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(updateEditorContentUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to ViewSwitchEvent', () => {
      expect(viewSwitchUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(viewSwitchUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
