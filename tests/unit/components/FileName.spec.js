import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import FileName from 'src/components/FileName.vue';
import FileEvent from 'src/composables/events/FileEvent';
import { useRoute } from 'vue-router';
import FileStatus from 'src/models/git/FileStatus';

installQuasarPlugin();
const mockFileStatus = new FileStatus({ headStatus: 0, workdirStatus: 0, stageStatus: 0 });

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/events/FileEvent', () => ({
  UpdateFileEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  getStatus: jest.fn(() => Promise.resolve([mockFileStatus])),
}));

describe('Test component: FileName', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  useRoute.mockImplementation(() => ({
    params: {
      projectName: 'project-00000000',
    },
  }));

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();

    FileEvent.UpdateFileEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(FileName, {
      props: {
        path: 'path',
        isActive: false,
        status: 'status',
        label: 'label',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: path', () => {
      it('Should match "path"', () => {
        expect(wrapper.vm.props.path).toEqual('path');
      });
    });

    describe('Test props: isActive', () => {
      it('Should be false', () => {
        expect(wrapper.vm.props.isActive).toEqual(false);
      });
    });

    describe('Test props: status', () => {
      it('Should match "status"', () => {
        expect(wrapper.vm.props.status).toEqual('status');
      });
    });

    describe('Test props: label', () => {
      it('Should match "label"', () => {
        expect(wrapper.vm.props.label).toEqual('label');
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: onUpdateFile', () => {
      it('Should set files status if value is equal to props.path', async () => {
        wrapper.vm.filesStatus = 'status';

        await wrapper.vm.onUpdateFile('path');

        expect(wrapper.vm.filesStatus).toEqual('status');
      });

      it('Should not set files status if value is not equal to props.path', async () => {
        wrapper.vm.filesStatus = '';

        await wrapper.vm.onUpdateFile('otherPath');

        expect(wrapper.vm.filesStatus).toEqual('');
      });
    });
  });

  describe('Test watcher: props.status', () => {
    it('Should be triggered when props.status is updated', async () => {
      await wrapper.setProps({
        path: 'path',
        isActive: false,
        status: 'newStatus',
        label: 'label',
      });

      expect(wrapper.vm.fileStatus).toEqual('newStatus');
    });
  });

  describe('Test hook function: onMounted', () => {
    it('Should subscribe UpdateFileEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('Should unsubscribe UpdateFileEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
