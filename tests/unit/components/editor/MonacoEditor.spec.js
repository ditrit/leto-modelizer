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
    layout,
    onDidChangeModelContent,
  }));

  beforeEach(() => {
    wrapper = shallowMount(MonacoEditor);
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
});
