import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import DefaultDialog from 'src/components/dialog/DefaultDialog.vue';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

describe('Test component: DefaultDialog', () => {
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

    wrapper = shallowMount(DefaultDialog, {
      props: {
        dialogKey: 'test',
      },
      global: {
        plugins: [
          createI18n(i18nConfiguration),
        ],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: dialogKey', () => {
      it('should match "test"', () => {
        expect(wrapper.vm.props.dialogKey).toEqual('test');
      });
    });
  });

  describe('Test functions: onDialogEvent', () => {
    it('should close dialog on good event', () => {
      wrapper.vm.show = true;
      wrapper.vm.onDialogEvent({ type: 'close', key: 'test' });
      expect(wrapper.vm.show).toBeFalsy();
    });
    it('should not close dialog when the key is not the expected', () => {
      wrapper.vm.show = true;
      wrapper.vm.onDialogEvent({ type: 'close', key: 'other' });
      expect(wrapper.vm.show).toBeTruthy();
    });

    it('should open dialog on good event', () => {
      wrapper.vm.show = false;
      wrapper.vm.onDialogEvent({ type: 'open', key: 'test' });
      expect(wrapper.vm.show).toBeTruthy();
    });

    it('should not open dialog when the key is not the expected', () => {
      wrapper.vm.show = false;
      wrapper.vm.onDialogEvent({ type: 'close', key: 'other' });
      expect(wrapper.vm.show).toBeFalsy();
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
