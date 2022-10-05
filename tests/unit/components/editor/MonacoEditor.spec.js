import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { editor } from 'app/__mocks__/monaco-editor';
import MonacoEditor from 'components/editor/MonacoEditor.vue';

installQuasarPlugin();

jest.mock('monaco-editor', () => ({
  __esModule: true,
  editor: {
    create: jest.fn(),
  },
}));

describe('Tess component: MonacoEditor', () => {
  let wrapper;

  const dispose = jest.fn();
  const layout = jest.fn();
  const onDidChangeModelContent = jest.fn();

  editor.create.mockImplementation(() => ({
    dispose,
    getValue: () => 'testValue',
    setValue: (v) => v,
    layout,
    onDidChangeModelContent,
  }));

  beforeEach(() => {
    wrapper = shallowMount(MonacoEditor, {
      props: {
        viewType: 'text',
        content: 'Hello World',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: viewType', () => {
      it('should match "text"', () => {
        expect(wrapper.vm.props.viewType).toEqual('text');
      });
    });

    describe('Test props: content', () => {
      it('should match "Hello World"', () => {
        expect(wrapper.vm.props.content).toEqual('Hello World');
      });
    });
  });

  describe('Test function: createEditor', () => {
    it('should init editor', () => {
      wrapper.vm.createEditor();
      expect(wrapper.vm.editor).not.toBeNull();
    });
  });

  describe('Test function: updateEditorLayout', () => {
    it('should be called', () => {
      expect(layout).toHaveBeenCalledTimes(0);
      wrapper.vm.container = {
        offsetHeight: 10,
        offsetWidth: 11,
      };
      wrapper.vm.updateEditorLayout();
      expect(layout).toHaveBeenCalledTimes(1);
      expect(layout).toHaveBeenLastCalledWith({
        height: 10,
        width: 11,
      });
    });
  });

  describe('Test watcher: props.content', () => {
    it('should be trigger when props.content is update with a different value', async () => {
      await wrapper.setProps({
        viewType: 'text',
        content: 'new content',
      });
      expect(wrapper.vm.props.content).toEqual('new content');
    });
  });
});
