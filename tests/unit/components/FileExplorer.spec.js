import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import FileExplorer from 'src/components/FileExplorer.vue';
import FileEvent from 'src/composables/events/FileEvent';

installQuasarPlugin();

jest.mock('src/composables/Project', () => ({
  readProjectFile: jest.fn().mockResolvedValue([{ path: 'terraform/app.tf', content: 'Hello World' }]),
}));

jest.mock('src/composables/events/FileEvent', () => ({
  OpenFileEvent: {
    next: jest.fn(),
  },
  ExpandFolderEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test component: FileExplorer', () => {
  let wrapper;
  let expandNodeSubscribe;
  let expandNodeUnsubscribe;

  const emit = jest.fn();

  FileEvent.OpenFileEvent.next.mockImplementation(() => emit());

  FileEvent.ExpandFolderEvent.subscribe.mockImplementation(() => {
    expandNodeSubscribe();
    return { unsubscribe: expandNodeUnsubscribe };
  });

  beforeEach(() => {
    expandNodeSubscribe = jest.fn();
    expandNodeUnsubscribe = jest.fn();

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
        nodes: [{
          id: 'terraform',
          icon: 'fa-solid fa-folder',
          label: 'terraform',
          children: [{
            id: 'terraform/app.tf', icon: 'fa-regular fa-file', label: 'app.tf', isFolder: false,
          }],
          isFolder: true,
        }],
        projectName: 'project-00000000',
        showParsableFiles: false,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: nodes', () => {
      it('should match nodes', () => {
        const nodes = [{
          id: 'terraform',
          icon: 'fa-solid fa-folder',
          label: 'terraform',
          children: [{
            id: 'terraform/app.tf', icon: 'fa-regular fa-file', label: 'app.tf', isFolder: false,
          }],
          isFolder: true,
        }];
        expect(wrapper.vm.props.nodes).toEqual(nodes);
      });
    });

    describe('Test props: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.props.projectName).toEqual('project-00000000');
      });
    });

    describe('Test props: showParsableFiles', () => {
      it('should be false', () => {
        expect(wrapper.vm.props.showParsableFiles).toEqual(false);
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

  describe('Test function: setSelectedFile', () => {
    it('should assign the value of selectedFile equal to the parameter', () => {
      wrapper.vm.setSelectedFile({ isSelected: true, id: 'terraform/app.tf' });
      expect(wrapper.vm.selectedFile).toEqual({ isSelected: true, id: 'terraform/app.tf' });
    });
  });

  describe('Test function: onNodeClicked', () => {
    it('should not emit when node.isFolder is true', async () => {
      expect(emit).not.toHaveBeenCalled();
      const node = {
        id: 'terraform',
        icon: 'fa-solid fa-folder',
        label: 'terraform',
        children: [{
          id: 'terraform/app.tf', icon: 'fa-regular fa-file', label: 'app.tf', isFolder: false,
        }],
        isFolder: true,
      };
      await wrapper.vm.onNodeClicked(node);
      expect(emit).not.toHaveBeenCalled();
    });

    it('should emit when node.isFolder is false', async () => {
      expect(emit).not.toHaveBeenCalled();
      const node = {
        id: 'terraform/app.tf', icon: 'fa-regular fa-file', label: 'app.tf', isFolder: false,
      };
      await wrapper.vm.onNodeClicked(node);
      expect(emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: setExpandedNode', () => {
    it('should call setExpanded', () => {
      wrapper.vm.fileExplorerRef = {
        setExpanded: jest.fn(),
      };
      wrapper.vm.setExpandedNode();
      expect(wrapper.vm.fileExplorerRef.setExpanded).toBeCalled();
    });
  });

  describe('Test hook function: onMounted', () => {

    it('should subscribe to ExpandFolderEvent', () => {
      expect(expandNodeSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to ExpandFolderEvent', () => {
      expect(expandNodeUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(expandNodeUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
