import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
import AIChatDrawer from 'src/components/drawer/AIChatDrawer.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { getPluginByName } from 'src/composables/PluginManager';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
  next: jest.fn(),
}));

jest.mock('src/composables/PluginManager', () => ({
  getDiagramFiles: jest.fn(() => []),
  getPluginByName: jest.fn(() => ({})),
}));

jest.mock('src/services/AIService', () => ({
  manageConversation: jest.fn(() => Promise.resolve({
    id: 'id_1',
  })),
  retrieveMessages: jest.fn((projectName) => Promise.resolve(projectName === 'test'
    ? {
      totalPages: 0,
      content: [],
    }
    : {
      totalPages: 2,
      content: [{ updateDate: new Date(), isUser: true, message: 'test' }],
    })),
  sendMessage: jest.fn(() => Promise.resolve({
    message: 'a',
  })),
}));

describe('Test component: AIChatDrawer', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;
  let next;

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();
    next = jest.fn();

    DialogEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });
    DialogEvent.next.mockImplementation(() => next());

    wrapper = mount(AIChatDrawer, {
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });
  });

  describe('Test function: startTypingEffect', () => {
    it('should stop without message', () => {
      wrapper.vm.submitting = true;
      wrapper.vm.startTypingEffect('');
      expect(wrapper.vm.submitting).toEqual(false);
    });

    it('should set all message without progressive typing', () => {
      wrapper.vm.progressiveTyping = false;
      wrapper.vm.lastAIMessage = { text: '' };
      wrapper.vm.startTypingEffect('test');

      expect(wrapper.vm.lastAIMessage.text).toEqual('test');
    });

    it('should set all message without progressive typing', async () => {
      wrapper.vm.progressiveTyping = true;
      wrapper.vm.lastAIMessage = { text: '' };
      wrapper.vm.startTypingEffect('t');

      expect(wrapper.vm.lastAIMessage.text).toEqual('t');
    });
  });

  describe('Test function submit', () => {
    it('should do nothing on shift enter', async () => {
      getPluginByName.mockImplementation(() => []);
      await wrapper.vm.submit({ shiftKey: true });
      expect(getPluginByName).not.toBeCalled();
    });

    it('should do nothing on already submitting request', async () => {
      wrapper.vm.submitting = true;
      wrapper.vm.text = 'a';
      getPluginByName.mockImplementation(() => []);
      await wrapper.vm.submit({ shiftKey: false });
      expect(getPluginByName).not.toBeCalled();
    });

    it('should do nothing on empty text', async () => {
      wrapper.vm.submitting = false;
      wrapper.vm.text = ' ';
      getPluginByName.mockImplementation(() => []);
      await wrapper.vm.submit({ shiftKey: false });
      expect(getPluginByName).not.toBeCalled();
    });

    it('should send messages', async () => {
      wrapper.vm.messages = [];
      wrapper.vm.lastAIMessage = null;
      wrapper.vm.text = 'test 1';

      await wrapper.vm.submit({ shiftKey: false });

      expect(wrapper.vm.messages).toEqual([{
        isMine: true,
        text: 'test 1',
      }]);
      expect(wrapper.vm.lastAIMessage).toEqual({ isMine: false, text: 'a' });
    });

    it('should add previous messages', async () => {
      wrapper.vm.messages = [];
      wrapper.vm.lastAIMessage = { text: 'test 1', isMine: false };
      wrapper.vm.text = 'test 2';

      await wrapper.vm.submit({ shiftKey: false });

      expect(wrapper.vm.messages).toEqual([{
        isMine: false,
        text: 'test 1',
      }, {
        isMine: true,
        text: 'test 2',
      }]);
      expect(wrapper.vm.lastAIMessage).toEqual({ isMine: false, text: 'a' });
    });
  });

  describe('Test function: loadMoreMessage', () => {
    it('should set old message', async () => {
      wrapper.vm.messages = [];
      await wrapper.vm.loadMoreMessage();

      expect(wrapper.vm.messages).toEqual([{
        isMine: true,
        text: 'test',
      }]);
      expect(wrapper.vm.haveMoreMessages).toEqual(true);
    });

    it('should not set without messages', async () => {
      wrapper.vm.messages = [];
      await wrapper.setProps({
        projectName: 'test',
      });
      await wrapper.vm.loadMoreMessage();

      expect(wrapper.vm.messages).toEqual([]);
      expect(wrapper.vm.haveMoreMessages).toEqual(false);
    });
  });

  describe('Test function clearConversation', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockClear();
      wrapper.vm.clearConversation();
      expect(DialogEvent.next).toBeCalledWith({
        key: 'DeleteAIConversation',
        type: 'open',
        projectName: '',
        diagramPath: '',
        pluginName: '',
      });
    });
  });

  describe('Test function: clean', () => {
    it('should not reset on bad key or type', () => {
      wrapper.vm.haveMoreMessages = true;
      wrapper.vm.clean({ key: 'bad', type: 'open' });
      wrapper.vm.clean({ key: 'bad', type: 'close' });

      expect(wrapper.vm.haveMoreMessages).toEqual(true);
    });

    it('should reset on valid key and type', () => {
      wrapper.vm.messages = ['test'];
      wrapper.vm.haveMoreMessages = true;
      wrapper.vm.lastAIMessage = {};
      wrapper.vm.clean({ key: 'DeleteAIConversation', type: 'close' });

      expect(wrapper.vm.messages).toEqual([]);
      expect(wrapper.vm.haveMoreMessages).toEqual(false);
      expect(wrapper.vm.lastAIMessage).toEqual(null);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe DrawerEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe DrawerEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
