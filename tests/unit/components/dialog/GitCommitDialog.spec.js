import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import GitCommitDialog from 'src/components/dialog/GitCommitDialog.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import FileStatus from 'src/models/git/FileStatus';
import FileEvent from 'src/composables/events/FileEvent';

installQuasarPlugin();
const mockStagedFileStatus = new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 2 });
const mockNotStagedFileStatus = new FileStatus({ headStatus: 1, workdirStatus: 0, stageStatus: 1 });

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  getStatus: jest.fn(() => Promise.resolve([mockStagedFileStatus, mockNotStagedFileStatus])),
}));

describe('Test component: GitCommitDialog', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();

    DialogEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(GitCommitDialog, {
      props: {
        projectName: 'test',
      },
      global: {
        plugins: [
          createI18n(i18nConfiguration),
        ],
      },
    });
  });

  describe('Test functions', () => {
    describe('Test function: setFilesStatus', () => {
      it('should set files status on valid event type', async () => {
        expect(wrapper.vm.stagedFiles).toEqual([]);

        await wrapper.vm.setFilesStatus({ key: 'GitCommit' });
        expect(wrapper.vm.stagedFiles).toEqual([mockStagedFileStatus]);
      });

      it('should not set files status on invalid event type', async () => {
        expect(wrapper.vm.stagedFiles).toEqual([]);

        await wrapper.vm.setFilesStatus({ key: 'InvalidEvent' });
        expect(wrapper.vm.stagedFiles).toEqual([]);
      });
    });
  });

  describe('Test function: onSave', () => {
    it('should emit event for update file and close dialog', async () => {
      FileEvent.UpdateFileEvent.next = jest.fn();
      DialogEvent.next = jest.fn();

      await wrapper.vm.setFilesStatus({ key: 'GitCommit' });
      await wrapper.vm.onSave();

      expect(FileEvent.UpdateFileEvent.next).toBeCalledWith(mockStagedFileStatus.path);
      expect(DialogEvent.next).toBeCalledWith({ key: 'GitCommit', type: 'close' });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe DialogEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe DialogEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
