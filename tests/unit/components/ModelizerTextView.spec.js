import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount, flushPromises } from '@vue/test-utils';
import ModelizerTextView from 'src/components/ModelizerTextView.vue';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';

installQuasarPlugin();

jest.mock('src/composables/Project', () => ({
  getProjectFiles: jest.fn(() => Promise.resolve([{ path: 'terraform/app.tf' }])),
  readProjectFile: jest.fn(() => Promise.resolve({ path: 'terraform/app.tf', content: 'new content' })),
  getProjectName: jest.fn(() => 'projectName'),
}));

jest.mock('src/composables/FileExplorer', () => ({
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
  },
  SelectFileEvent: {
    next: jest.fn(),
  },
}));

jest.mock('src/composables/events/GitEvent', () => ({
  UpdateRemoteEvent: {
    subscribe: jest.fn(),
  },
  CheckoutEvent: {
    subscribe: jest.fn(),
  },
}));

describe('Test component: ModelizerTextView', () => {
  let wrapper;
  let openFileSubscribe;
  let openFileUnsubscribe;
  let updateRemoteSubscribe;
  let updateRemoteUnsubscribe;
  let checkoutSubscribe;
  let checkoutUnsubscribe;
  let emit;

  beforeEach(() => {
    openFileSubscribe = jest.fn();
    openFileUnsubscribe = jest.fn();
    updateRemoteSubscribe = jest.fn();
    updateRemoteUnsubscribe = jest.fn();
    checkoutSubscribe = jest.fn();
    checkoutUnsubscribe = jest.fn();

    GitEvent.UpdateRemoteEvent.subscribe.mockImplementation(() => {
      updateRemoteSubscribe();
      return { unsubscribe: updateRemoteUnsubscribe };
    });
    FileEvent.OpenFileEvent.subscribe.mockImplementation(() => {
      openFileSubscribe();
      return { unsubscribe: openFileUnsubscribe };
    });
    GitEvent.CheckoutEvent.subscribe.mockImplementation(() => {
      checkoutSubscribe();
      return { unsubscribe: checkoutUnsubscribe };
    });

    wrapper = shallowMount(ModelizerTextView, {
      props: {
        viewType: 'text',
        projectName: 'project-00000000',
      },
      mocks: {
        FileEvent,
        GitEvent,
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: viewType', () => {
      it('should match "text"', () => {
        expect(wrapper.vm.viewType).toEqual('text');
      });
    });

    describe('Test props: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });
  });

  describe('Test function: onOpenFileEvent', () => {
    it('should set activeFileId value equal to onOpenFileEvent param.id ', () => {
      wrapper.vm.onOpenFileEvent({ id: 'terraform/app.tf', label: 'app.tf', content: '' });

      expect(wrapper.vm.activeFileId).toEqual('terraform/app.tf');
    });

    it('should push the new file to files Array if it is not already there', () => {
      wrapper.vm.files = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }];
      wrapper.vm.onOpenFileEvent({ id: 'README.md', label: 'README.md', content: '' });

      expect(wrapper.vm.files).toEqual([{ id: 'terraform/app.tf', label: 'app.tf', content: '' }, { id: 'README.md', label: 'README.md', content: '' }]);
    });

    it('should not push the new file to files Array if it is already there', () => {
      wrapper.vm.files = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }];
      wrapper.vm.onOpenFileEvent({ id: 'terraform/app.tf', label: 'app.tf', content: '' });

      expect(wrapper.vm.files).toEqual([{ id: 'terraform/app.tf', label: 'app.tf', content: '' }]);
    });
  });

  describe('Test function: closeFile', () => {
    beforeEach(() => {
      emit = jest.fn();

      FileEvent.SelectFileEvent.next.mockImplementation(() => emit());
    });

    describe('The file to close is contained within files Array', () => {
      it('should remove file if files length is 2 or more', () => {
        wrapper.vm.files = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }, { id: 'README.md', label: 'README.md', content: '' }];
        wrapper.vm.closeFile('terraform/app.tf');

        expect(wrapper.vm.files).toEqual([{ id: 'README.md', label: 'README.md', content: '' }]);
      });

      it('should remove file if files length is 1', () => {
        wrapper.vm.files = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }];
        wrapper.vm.closeFile('terraform/app.tf');

        expect(wrapper.vm.files).toEqual([]);
      });
    });

    describe('Closing the active file, then files Array is empty', () => {
      it('should set activeFileId to an emtpy string and emit the new value', () => {
        expect(emit).not.toHaveBeenCalled();
        wrapper.vm.files = [{ id: 'README.md', label: 'README.md', content: '' }];
        wrapper.vm.activeFileId = 'README.md';
        wrapper.vm.closeFile('README.md');

        expect(wrapper.vm.files).toHaveLength(0);
        expect(wrapper.vm.activeFileId).toEqual('');
        expect(emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('Closing the active file, then files Array is not empty', () => {
      it('should set a new value to activeFileId and emit the new value', () => {
        expect(emit).not.toHaveBeenCalled();
        wrapper.vm.files = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }, { id: 'README.md', label: 'README.md', content: '' }];
        wrapper.vm.activeFileId = 'README.md';
        wrapper.vm.closeFile('README.md');

        expect(wrapper.vm.files).toEqual([{ id: 'terraform/app.tf', label: 'app.tf', content: '' }]);
        expect(wrapper.vm.files).toHaveLength(1);
        expect(wrapper.vm.activeFileId).toEqual('terraform/app.tf');
        expect(emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('Closing a non active file', () => {
      it('should not set a new value to activeFileId and not emit the new value', () => {
        wrapper.vm.files = [{ id: 'terraform/app.tf', label: 'app.tf', content: '' }, { id: 'README.md', label: 'README.md', content: '' }];
        wrapper.vm.activeFileId = 'terraform/app.tf';
        wrapper.vm.closeFile('README.md');

        expect(wrapper.vm.files).toEqual([{ id: 'terraform/app.tf', label: 'app.tf', content: '' }]);
        expect(wrapper.vm.files).toHaveLength(1);
        expect(wrapper.vm.activeFileId).toEqual('terraform/app.tf');
        expect(emit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Test function: updateProjectFiles', () => {
    it('Should update nodes', async () => {
      wrapper.vm.nodes = [
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
              id: 'branch.txt', icon: 'fa-regular fa-file', label: 'branch.txt', isFolder: false,
            },
          ],
        },
      ];

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

    it('Should update files', async () => {
      wrapper.vm.files = [{ id: 'terraform/app.tf', label: 'app.tf', content: 'content' }];
      wrapper.vm.updateProjectFiles();
      await flushPromises();
      expect(wrapper.vm.files).toEqual([{ id: 'terraform/app.tf', content: 'new content', label: 'app.tf' }]);
    });

    it('Should update active file if it is no more contained in updated files', async () => {
      wrapper.vm.files = [{ id: 'README.md', label: 'README.md', content: 'content' }, { id: 'terraform/app.tf', label: 'app.tf', content: 'content' }];
      wrapper.vm.activeFileId = 'README.md';

      wrapper.vm.updateProjectFiles();
      await flushPromises();
      expect(wrapper.vm.activeFileId).toEqual('terraform/app.tf');
    });

    it('Should update active file if it is no more contained in updated empty files', async () => {
      wrapper.vm.files = [{ id: 'README.md', label: 'README.md', content: 'content' }];
      wrapper.vm.activeFileId = 'README.md';

      wrapper.vm.updateProjectFiles();
      await flushPromises();
      expect(wrapper.vm.activeFileId).toEqual('');
    });

    it('Should not update active file if it is still contained in updated files', async () => {
      wrapper.vm.files = [{ id: 'terraform/app.tf', label: 'app.tf', content: 'other content' }, { id: 'README.md', label: 'README.md', content: 'content' }];
      wrapper.vm.activeFileId = 'terraform/app.tf';

      wrapper.vm.updateProjectFiles();
      await flushPromises();
      expect(wrapper.vm.activeFileId).toEqual('terraform/app.tf');
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
  });
});
