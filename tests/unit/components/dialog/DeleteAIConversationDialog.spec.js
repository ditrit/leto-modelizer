import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import DeleteAIConversationDialog from 'src/components/dialog/DeleteAIConversationDialog';
import DialogEvent from 'src/composables/events/DialogEvent';
import { deleteConversation } from 'src/services/AIService';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
  next: jest.fn(),
}));

jest.mock('src/services/AIService', () => ({
  deleteConversation: jest.fn(() => Promise.resolve()),
}));

describe('Test component: DeleteAIConversationDialog', () => {
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

    wrapper = shallowMount(DeleteAIConversationDialog, {
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });
  });

  describe('Test function: setAIConversationId', () => {
    it('should not set variable', () => {
      expect(wrapper.vm.projectName).toBeNull();
      expect(wrapper.vm.diagramPath).toBeNull();
      expect(wrapper.vm.pluginName).toBeNull();

      wrapper.vm.setAIConversationId({
        key: 'test',
        projectName: 'projectName',
        diagramPath: 'diagramPath',
        pluginName: 'pluginName',
      });

      expect(wrapper.vm.projectName).toBeNull();
      expect(wrapper.vm.diagramPath).toBeNull();
      expect(wrapper.vm.pluginName).toBeNull();
    });

    it('should set variable', () => {
      expect(wrapper.vm.projectName).toBeNull();
      expect(wrapper.vm.diagramPath).toBeNull();
      expect(wrapper.vm.pluginName).toBeNull();

      wrapper.vm.setAIConversationId({
        key: 'DeleteAIConversation',
        projectName: 'projectName',
        diagramPath: 'diagramPath',
        pluginName: 'pluginName',
      });

      expect(wrapper.vm.projectName).toEqual('projectName');
      expect(wrapper.vm.diagramPath).toEqual('diagramPath');
      expect(wrapper.vm.pluginName).toEqual('pluginName');
    });
  });

  describe('Test function: submit', () => {
    it('should delete conversation', async () => {
      deleteConversation.mockClear();
      wrapper.vm.submitting = true;

      await wrapper.vm.submit();

      expect(deleteConversation).toBeCalled();
      expect(wrapper.vm.submitting).toEqual(false);
      expect(DialogEvent.next).toBeCalledWith({
        key: 'DeleteAIConversation',
        type: 'close',
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
