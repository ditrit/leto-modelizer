import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import RenameModelDialog from 'src/components/dialog/RenameModelDialog';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

describe('Test component: RenameModelDialog', () => {
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

    wrapper = shallowMount(RenameModelDialog, {
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

  describe('Test function: setRenamedModel', () => {
    it('should set renamedModel on valid event key', () => {
      expect(wrapper.vm.renamedModel).toBeNull();

      wrapper.vm.setRenamedModel({ key: 'RenameModel', model: {} });
      expect(wrapper.vm.renamedModel).toEqual({});
    });

    it('should not set renamedModel on invalid event key', () => {
      wrapper.vm.setRenamedModel({ key: 'NotRenameModel', model: {} });
      expect(wrapper.vm.renamedModel).toBeNull();
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
