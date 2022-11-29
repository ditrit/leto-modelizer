import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import GitLogDialog from 'src/components/dialog/GitLogDialog.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import { gitLog } from 'src/composables/Project';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  gitLog: jest.fn((projectId, commitRef, depth) => {
    const logs = [];
    if (depth === 26) {
      logs.push({
        oid: commitRef,
      });
    }
    for (let index = 0; index < 25; index += 1) {
      logs.push({
        oid: `log${index}`,
      });
    }
    return Promise.resolve(logs);
  }),
}));

describe('Test component: GitLogDialog', () => {
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

    wrapper = shallowMount(GitLogDialog, {
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

  describe('Test functions', () => {
    describe('Test function: setBranchName', () => {
      it('should set branch name on valid event type', () => {
        expect(wrapper.vm.branchName).toBeNull();

        wrapper.vm.setBranchName({ key: 'GitLog', branch: 'test' });
        expect(wrapper.vm.branchName).toEqual('test');
      });

      it('should not set branch name on invalid event type', () => {
        expect(wrapper.vm.branchName).toBeNull();

        wrapper.vm.setBranchName({ key: 'InvalidEvent', branch: 'test' });
        expect(wrapper.vm.branchName).toBeNull();
      });
    });

    describe('Test function: onLoad', () => {
      it('should be called with depth 25 when logs are empty', async () => {
        expect(wrapper.vm.logItems).toEqual([]);

        const done = jest.fn();
        await wrapper.vm.onLoad(0, done);
        expect(gitLog).toBeCalledWith('test', null, 25);
        expect(done).toBeCalled();
      });

      it('should call gitLog with 26 as depth and have no duplication in return', async () => {
        wrapper.vm.logItems = [{
          oid: 'last',
        }];

        const done = jest.fn();
        await wrapper.vm.onLoad(0, done);

        expect(wrapper.vm.logItems.length).toEqual(26);
        expect(gitLog).toBeCalledWith('test', 'last', 26);
        expect(wrapper.vm.logItems.filter(({ oid }) => oid === 'last').length).toEqual(1);
      });
    });

    describe('Test function: truncateCommitMessage', () => {
      it('should truncate text with break line', () => {
        const result = wrapper.vm.truncateCommitMessage('test\nblabla');
        expect(result).toEqual('test');
      });

      it('should not truncate text without break line', async () => {
        const result = wrapper.vm.truncateCommitMessage('test blabla');
        expect(result).toEqual('test blabla');
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
