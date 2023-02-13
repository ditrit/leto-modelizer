import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import ImportModelTemplateDialog from 'src/components/dialog/ImportModelTemplateDialog.vue';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

describe('Test component: ImportModelTemplateDialog', () => {
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

    wrapper = shallowMount(ImportModelTemplateDialog, {
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
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

  describe('Test function: setModelTemplate', () => {
    it('should set modelTemplate on valid event key', () => {
      expect(wrapper.vm.modelTemplate).toBeNull();

      wrapper.vm.setModelTemplate({ key: 'ImportModelTemplate', template: {} });
      expect(wrapper.vm.modelTemplate).toEqual({});
    });

    it('should not set modelTemplate on invalid event key', () => {
      wrapper.vm.setModelTemplate({ key: 'NotImportModelTemplate', template: {} });
      expect(wrapper.vm.modelTemplate).toBeNull();
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
