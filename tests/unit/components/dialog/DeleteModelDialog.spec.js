import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import DeleteModelDialog from 'src/components/dialog/DeleteModelDialog';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

describe('Test component: DeleteModelDialog', () => {
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

    wrapper = shallowMount(DeleteModelDialog, {
      props: {
        projectName: 'projectName',
      },
    });
  });

  describe('Test props: projectName', () => {
    it('should match "projectName"', () => {
      expect(wrapper.vm.projectName).toEqual('projectName');
    });
  });

  describe('Test function: setDeletedModel', () => {
    it('should set deletedModel on valid event key', () => {
      expect(wrapper.vm.deletedModel).toBeNull();

      wrapper.vm.setDeletedModel({ key: 'DeleteModel', model: {} });
      expect(wrapper.vm.deletedModel).toEqual({});
    });

    it('should not set deletedModel on invalid event key', () => {
      wrapper.vm.setDeletedModel({ key: 'NotDeleteModel', model: {} });
      expect(wrapper.vm.deletedModel).toBeNull();
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
