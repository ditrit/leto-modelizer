import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount, flushPromises } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import FileExplorer from 'src/components/FileExplorer.vue';
import FileEvent from 'src/composables/events/FileEvent';
import FileExplorerComposable from 'src/composables/FileExplorer';

installQuasarPlugin();

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
}));

jest.mock('src/composables/events/FileEvent', () => ({
  SelectFileTabEvent: {
    next: jest.fn(),
    subscribe: jest.fn(),
  },
  CreateFileNodeEvent: {
    subscribe: jest.fn(),
  },
  SelectFileNodeEvent: {
    next: jest.fn(),
  },
}));

describe('Test component: FileExplorer', () => {
  let wrapper;
  let selectFileTabEventSubscribe;
  let selectFileTabEventUnsubscribe;
  let createFileNodeEventSubscribe;
  let createFileNodeEventUnsubscribe;
  let selectFileNodeEventNext;

  beforeEach(() => {
    selectFileTabEventSubscribe = jest.fn();
    selectFileTabEventUnsubscribe = jest.fn();
    createFileNodeEventSubscribe = jest.fn();
    createFileNodeEventUnsubscribe = jest.fn();
    selectFileNodeEventNext = jest.fn();

    FileEvent.SelectFileTabEvent.subscribe.mockImplementation(() => {
      selectFileTabEventSubscribe();
      return { unsubscribe: selectFileTabEventUnsubscribe };
    });

    FileEvent.CreateFileNodeEvent.subscribe.mockImplementation(() => {
      createFileNodeEventSubscribe();
      return { unsubscribe: createFileNodeEventUnsubscribe };
    });

    FileEvent.SelectFileNodeEvent.next.mockImplementation(selectFileNodeEventNext);

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
        fileInformations: [
          {
            path: 'terraform/app.tf',
          },
        ],
        projectName: 'project-00000000',
        showParsableFiles: false,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: fileInformations', () => {
      it('should match fileInformations', () => {
        expect(wrapper.vm.props.fileInformations).toEqual([{ path: 'terraform/app.tf' }]);
      });
    });

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

  describe('Test function: updateFileExplorer', () => {
    it('should update nodes', () => {
      wrapper.vm.updateFileExplorer();

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

  describe('Test watcher: props.fileInformations', () => {
    it('should be triggered and update nodes when props.fileInformations is updated', async () => {
      await wrapper.setProps({
        fileInformations: [
          {
            path: 'terraform/app.tf',
          },
          {
            path: 'README.md',
          },
        ],
      });

      const newNodes = [{
        id: 'projectName',
        label: 'projectName',
        isFolder: true,
        children: [
          {
            id: 'terraform',
            label: 'terraform',
            children: [{
              id: 'terraform/app.tf',
              label: 'app.tf',
              isFolder: false,
            }],
            isFolder: true,
          },
          {
            id: 'README.md',
            label: 'README.md',
            isFolder: false,
          },
        ],
      }];

      FileExplorerComposable.getTree.mockImplementation(jest.fn(() => newNodes));

      await wrapper.vm.updateFileExplorer();
      await flushPromises();

      expect(wrapper.vm.nodes).toEqual(newNodes);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to SelectFileTabEvent', () => {
      expect(selectFileTabEventSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to CreateFileNodeEvent', () => {
      expect(createFileNodeEventSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to SelectFileTabEvent', () => {
      expect(createFileNodeEventUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(createFileNodeEventUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to CreateFileNodeEvent', () => {
      expect(createFileNodeEventUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(createFileNodeEventUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
