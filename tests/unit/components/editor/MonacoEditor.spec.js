import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { editor } from 'app/__mocks__/monaco-editor';
import MonacoEditor from 'components/editor/MonacoEditor.vue';
import Project from 'src/composables/Project';
import FileEvent from 'src/composables/events/FileEvent';

installQuasarPlugin();

jest.mock('monaco-editor', () => ({
  __esModule: true,
  editor: {
    create: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  writeProjectFile: jest.fn(),
}));

jest.mock('src/composables/events/FileEvent', () => ({
  UpdateFileEvent: {
    next: jest.fn(),
  },
}));

describe('Tess component: MonacoEditor', () => {
  let wrapper;

  const dispose = jest.fn();
  const layout = jest.fn();
  const onDidChangeModelContent = jest.fn();
  const writeProjectFileMock = jest.fn(() => Promise.resolve());

  editor.create.mockImplementation(() => ({
    dispose,
    getValue: () => 'testValue',
    setValue: (v) => v,
    layout,
    onDidChangeModelContent,
  }));

  Project.writeProjectFile.mockImplementation(writeProjectFileMock);

  beforeEach(() => {
    wrapper = shallowMount(MonacoEditor, {
      props: {
        projectName: 'project-00000000',
        fileInput: {
          content: 'Hello World',
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.props.projectName).toEqual('project-00000000');
      });
    });

    describe('Test props: fileInput', () => {
      it('should have content matching "Hello World"', () => {
        expect(wrapper.vm.props.fileInput.content).toEqual('Hello World');
      });
    });
  });

  describe('Test function: updateFile', () => {
    it('should call writeProjectFile and emit event', async () => {
      await wrapper.vm.updateFile();
      expect(writeProjectFileMock).toHaveBeenCalledTimes(1);
      expect(FileEvent.UpdateFileEvent.next).toHaveBeenCalled();
    });
  });

  describe('Test function: createEditor', () => {
    it('should init editor', () => {
      wrapper.vm.createEditor();
      expect(wrapper.vm.editor).not.toBeNull();
      expect(onDidChangeModelContent).toHaveBeenCalled();
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

  describe('Test watcher: props.fileInput', () => {
    it('should be trigger when props.fileInput is update', async () => {
      await wrapper.setProps({
        projectName: 'project-00000000',
        fileInput: {
          content: 'new content',
        },
      });
      expect(wrapper.vm.props.fileInput.content).toEqual('new content');
    });
  });
});
