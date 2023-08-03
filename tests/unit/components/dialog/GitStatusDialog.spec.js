import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import GitStatusDialog from 'src/components/dialog/GitStatusDialog.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import FileStatus from 'src/models/git/FileStatus';

installQuasarPlugin();
const mockFileStatus = new FileStatus({ headStatus: 0, workdirStatus: 0, stageStatus: 0 });

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  getStatus: jest.fn(() => Promise.resolve([mockFileStatus])),
}));

describe('Test component: GitStatusDialog', () => {
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

    wrapper = shallowMount(GitStatusDialog, {
      props: {
        projectName: 'test',
      },
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });
  });

  describe('Test computed', () => {
    describe('Test computed: stagedFiles', () => {
      it('should be empty without staged file', () => {
        wrapper.vm.filesStatus = [
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 0 }),
        ];
        expect(wrapper.vm.stagedFiles).toEqual([]);
      });

      it('should have one staged file', () => {
        wrapper.vm.filesStatus = [
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 2 }),
        ];
        expect(wrapper.vm.stagedFiles).toEqual([
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 2 }),
        ]);
      });

      it('should have two staged files', () => {
        wrapper.vm.filesStatus = [
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 2 }),
          new FileStatus({ headStatus: 0, workdirStatus: 0, stageStatus: 3 }),
        ];
        expect(wrapper.vm.stagedFiles).toEqual([
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 2 }),
          new FileStatus({ headStatus: 0, workdirStatus: 0, stageStatus: 3 }),
        ]);
      });
    });

    describe('Test computed: modifiedFiles', () => {
      it('should be empty without unstaged changed file', () => {
        wrapper.vm.filesStatus = [
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 0 }),
        ];
        expect(wrapper.vm.modifiedFiles).toEqual([]);
      });

      it('should have one unstaged changed file', () => {
        wrapper.vm.filesStatus = [
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 3 }),
        ];
        expect(wrapper.vm.modifiedFiles).toEqual([
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 3 }),
        ]);
      });
    });

    describe('Test computed: untrackedFiles', () => {
      it('should be empty without untracked file', () => {
        wrapper.vm.filesStatus = [
          new FileStatus({ headStatus: 1, workdirStatus: 0, stageStatus: 1 }),
        ];
        expect(wrapper.vm.untrackedFiles).toEqual([]);
      });

      it('should have one untracked file', () => {
        wrapper.vm.filesStatus = [
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 0 }),
        ];
        expect(wrapper.vm.untrackedFiles).toEqual([
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 0 }),
        ]);
      });
    });

    describe('Test computed: noFiles', () => {
      it('should be true without files', () => {
        wrapper.vm.filesStatus = [];
        expect(wrapper.vm.noFiles).toEqual(true);
      });

      it('should be false with files', () => {
        wrapper.vm.filesStatus = [
          new FileStatus({ headStatus: 0, workdirStatus: 2, stageStatus: 0 }),
        ];
        expect(wrapper.vm.noFiles).toEqual(false);
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: setBranchName', () => {
      it('should set files status on valid event type', async () => {
        expect(wrapper.vm.filesStatus).toEqual([]);

        await wrapper.vm.setFilesStatus({ key: 'GitStatus' });
        expect(wrapper.vm.filesStatus).toEqual([mockFileStatus]);
      });

      it('should not set files status on invalid event type', async () => {
        expect(wrapper.vm.filesStatus).toEqual([]);

        await wrapper.vm.setFilesStatus({ key: 'InvalidEvent' });
        expect(wrapper.vm.filesStatus).toEqual([]);
      });
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
