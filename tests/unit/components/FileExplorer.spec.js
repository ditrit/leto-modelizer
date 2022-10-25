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
  SelectFileEvent: {
    subscribe: jest.fn(),
  },
  ExpandFolderEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test component: FileExplorer', () => {
  let wrapper;
  let selectFileSubscribe;
  let selectFileUnsubscribe;
  let expandNodeSubscribe;
  let expandNodeUnsubscribe;

  const emit = jest.fn();

  FileEvent.OpenFileEvent.next.mockImplementation(() => emit());

  FileEvent.SelectFileEvent.subscribe.mockImplementation(() => {
    selectFileSubscribe();
    return { unsubscribe: selectFileUnsubscribe };
  });
  FileEvent.ExpandFolderEvent.subscribe.mockImplementation(() => {
    expandNodeSubscribe();
    return { unsubscribe: expandNodeUnsubscribe };
  });

  beforeEach(() => {
    selectFileSubscribe = jest.fn();
    selectFileUnsubscribe = jest.fn();
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
    it('should subscribe to SelectFileEvent', () => {
      expect(selectFileSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to ExpandFolderEvent', () => {
      expect(expandNodeSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to SelectFileEvent', () => {
      expect(selectFileUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(selectFileUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to ExpandFolderEvent', () => {
      expect(expandNodeUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(expandNodeUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
