import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import NewProjectTemplateDialog from 'src/components/dialog/NewProjectTemplateDialog.vue';
import { useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import { directive as viewer } from 'v-viewer';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

describe('Test component: NewProjectTemplateDialog', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  const push = jest.fn();

  useRouter.mockImplementation(() => ({
    push,
  }));

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();

    DialogEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(NewProjectTemplateDialog, {
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
        directives: {
          viewer,
        },
      },
    });
  });

  describe('Test computed', () => {
    describe('Test computed: templateName', () => {
      it('should be equal to projectTemplate type', () => {
        wrapper.vm.projectTemplate = { type: 'test' };
        expect(wrapper.vm.templateName).toEqual('test');
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: addProject', () => {
      it('should emit an event and redirect to project model page', () => {
        DialogEvent.next = jest.fn();
        expect(DialogEvent.next).not.toHaveBeenCalled();

        wrapper.vm.addProject('test');

        expect(DialogEvent.next).toBeCalledWith({ type: 'close', key: 'NewProjectTemplate' });
        expect(push).toBeCalledWith('/modelizer/test/models');
      });
    });

    describe('Test function: setProjectTemplate', () => {
      it('should set projectTemplate value on valid event type', () => {
        expect(wrapper.vm.projectTemplate).toBeNull();

        wrapper.vm.setProjectTemplate({ key: 'NewProjectTemplate', template: 'test' });
        expect(wrapper.vm.projectTemplate).toEqual('test');
      });

      it('should not set projectTemplate on invalid event type', () => {
        expect(wrapper.vm.projectTemplate).toBeNull();

        wrapper.vm.setProjectTemplate({ key: 'InvalidEvent', template: 'test' });
        expect(wrapper.vm.projectTemplate).toBeNull();
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to DialogEvent', async () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to DialogEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
