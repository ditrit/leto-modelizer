import { shallowMount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import DialogEvent from 'src/composables/events/DialogEvent';
import FileExplorerActionMenu from 'components/menu/FileExplorerActionMenu';
import { Notify } from 'quasar';
import GitEvent from 'src/composables/events/GitEvent';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/events/GitEvent', () => ({
  AddEvent: {
    next: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  gitAdd: jest.fn((projectId) => {
    if (projectId === 'error') {
      return Promise.reject({ name: 'error' });
    }
    return Promise.resolve();
  }),
}));

describe('Test component: FileExplorerActionMenu', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileExplorerActionMenu, {
      props: {
        file: { id: 'test' },
        projectName: 'projectName',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test variable: loading', () => {
      it('should be false', () => {
        expect(wrapper.vm.loading).toEqual({ add: false });
      });
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: file', () => {
      it('should match file', () => {
        expect(wrapper.vm.file).toStrictEqual({ id: 'test' });
      });
    });

    describe('Test prop: projectName', () => {
      it('should match "projectName"', () => {
        expect(wrapper.vm.projectName).toStrictEqual('projectName');
      });
    });
  });

  describe('Test computed', () => {
    describe('Test computed: isFile', () => {
      it('should be true if props.file is not a folder', async () => {
        await wrapper.setProps({
          file: {
            isFolder: false,
          },
        });

        expect(wrapper.vm.isFile).toEqual(true);
      });

      it('should be false if props.file is a folder', async () => {
        await wrapper.setProps({
          file: {
            isFolder: true,
          },
        });

        expect(wrapper.vm.isFile).toEqual(false);
      });
    });

    describe('Test computed: allowGitAdd', () => {
      it('should be true if props.file is untracked, unstaged and modified', async () => {
        await wrapper.setProps({
          file: {
            information: {
              isUntracked: true,
              isUnstaged: true,
              hasUnstagedChanged: true,
            },
          },
        });

        expect(wrapper.vm.allowGitAdd).toEqual(true);
      });

      it('should be true if props.file is untracked', async () => {
        await wrapper.setProps({
          file: {
            information: {
              isUntracked: true,
              isUnstaged: false,
              hasUnstagedChanged: false,
            },
          },
        });

        expect(wrapper.vm.allowGitAdd).toEqual(true);
      });

      it('should be true if props.file is unstaged', async () => {
        await wrapper.setProps({
          file: {
            information: {
              isUntracked: false,
              isUnstaged: true,
              hasUnstagedChanged: false,
            },
          },
        });

        expect(wrapper.vm.allowGitAdd).toEqual(true);
      });

      it('should be true if props.file is modified', async () => {
        await wrapper.setProps({
          file: {
            information: {
              isUntracked: false,
              isUnstaged: false,
              hasUnstagedChanged: true,
            },
          },
        });

        expect(wrapper.vm.allowGitAdd).toEqual(true);
      });

      it('should be false if props.file is staged, unmodified and tracked', async () => {
        await wrapper.setProps({
          file: {
            information: {
              isUntracked: false,
              isUnstaged: false,
              hasUnstagedChanged: false,
            },
          },
        });

        expect(wrapper.vm.allowGitAdd).toEqual(false);
      });

      it('should be false if props.file.information doesn\'t exist', async () => {
        await wrapper.setProps({
          file: {},
        });

        expect(wrapper.vm.allowGitAdd).toEqual(false);
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: createFile', () => {
      it('should call dialog event to create file', () => {
        DialogEvent.next = jest.fn(() => Promise.resolve({
          type: 'open',
          key: 'CreateFile',
          file: wrapper.vm.file,
          isFolder: false,
        }));
        wrapper.vm.menu = {
          hide: jest.fn(),
        };

        wrapper.vm.createFile(false);
        expect(DialogEvent.next).toBeCalled();
        expect(wrapper.vm.menu.hide).toBeCalled();
      });

      it('should call dialog event to create folder', () => {
        DialogEvent.next = jest.fn(() => Promise.resolve({
          type: 'open',
          key: 'CreateFile',
          file: wrapper.vm.file,
          isFolder: true,
        }));
        wrapper.vm.menu = {
          hide: jest.fn(),
        };

        wrapper.vm.createFile(true);
        expect(DialogEvent.next).toBeCalled();
        expect(wrapper.vm.menu.hide).toBeCalled();
      });
    });

    describe('Test function: deleteFile', () => {
      it('should call dialog event', () => {
        DialogEvent.next = jest.fn(() => Promise.resolve({
          type: 'open',
          key: 'DeleteFile',
          file: wrapper.vm.file,
        }));
        wrapper.vm.menu = {
          hide: jest.fn(),
        };

        wrapper.vm.deleteFile();
        expect(DialogEvent.next).toBeCalled();
        expect(wrapper.vm.menu.hide).toBeCalled();
      });
    });

    describe('Test function: addFile', () => {
      it('should emit AddEvent on success and a notification', async () => {
        wrapper.vm.loading.add = true;
        wrapper.vm.menu = {
          hide: jest.fn(),
        };
        Notify.create = jest.fn();

        await wrapper.vm.addFile({ id: 'filePath' });

        expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
        expect(GitEvent.AddEvent.next).toBeCalled();
        expect(wrapper.vm.loading.add).toEqual(false);
        expect(wrapper.vm.menu.hide).toBeCalled();
      });

      it('should emit a notification on error', async () => {
        wrapper = shallowMount(FileExplorerActionMenu, {
          props: {
            projectName: 'error',
            file: {
              id: 'filePath',
            },
          },
        });
        wrapper.vm.loading.add = true;
        wrapper.vm.menu = {
          hide: jest.fn(),
        };
        Notify.create = jest.fn();

        await wrapper.vm.addFile({ id: 'filePath' });

        expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
        expect(wrapper.vm.loading.add).toEqual(false);
        expect(wrapper.vm.menu.hide).toBeCalled();
      });
    });
  });
});
