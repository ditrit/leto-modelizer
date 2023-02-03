import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { editor } from 'app/__mocks__/monaco-editor';
import MonacoEditor from 'components/editor/MonacoEditor.vue';
import Project from 'src/composables/Project';
import GitEvent from 'src/composables/events/GitEvent';
import FileEvent from 'src/composables/events/FileEvent';
import { FileInput } from 'leto-modelizer-plugin-core';

installQuasarPlugin();

jest.mock('monaco-editor', () => ({
  __esModule: true,
  editor: {
    create: jest.fn(),
  },
}));

jest.mock('src/composables/Project', () => ({
  writeProjectFile: jest.fn(),
  readProjectFile: jest.fn(() => Promise.resolve('fileContent')),
}));

jest.mock('src/composables/events/GitEvent', () => ({
  CheckoutEvent: {
    subscribe: jest.fn(),
  },
  AddRemoteEvent: {
    subscribe: jest.fn(),
  },
  PullEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/events/FileEvent', () => ({
  UpdateFileContentEvent: {
    subscribe: jest.fn(),
  },
  UpdateEditorContentEvent: {
    next: jest.fn(),
  },
}));

describe('Tess component: MonacoEditor', () => {
  let wrapper;
  let checkoutSubscribe;
  let checkoutUnsubscribe;
  let addRemoteSubscribe;
  let addRemoteUnsubscribe;
  let pullSubscribe;
  let pullUnsubscribe;
  let updateFileContentSubscribe;
  let updateFileContentUnsubscribe;

  const dispose = jest.fn();
  const layout = jest.fn();
  const setValue = jest.fn();
  const onDidChangeModelContent = jest.fn();
  const writeProjectFileMock = jest.fn(() => Promise.resolve());

  editor.create.mockImplementation(() => ({
    dispose,
    getValue: () => 'testValue',
    setValue,
    layout,
    onDidChangeModelContent,
  }));

  Project.writeProjectFile.mockImplementation(writeProjectFileMock);

  beforeEach(() => {
    checkoutSubscribe = jest.fn();
    checkoutUnsubscribe = jest.fn();
    addRemoteSubscribe = jest.fn();
    addRemoteUnsubscribe = jest.fn();
    pullSubscribe = jest.fn();
    pullUnsubscribe = jest.fn();
    updateFileContentSubscribe = jest.fn();
    updateFileContentUnsubscribe = jest.fn();

    GitEvent.CheckoutEvent.subscribe.mockImplementation(() => {
      checkoutSubscribe();
      return { unsubscribe: checkoutUnsubscribe };
    });
    GitEvent.AddRemoteEvent.subscribe.mockImplementation(() => {
      addRemoteSubscribe();
      return { unsubscribe: addRemoteUnsubscribe };
    });
    GitEvent.PullEvent.subscribe.mockImplementation(() => {
      pullSubscribe();
      return { unsubscribe: pullUnsubscribe };
    });
    FileEvent.UpdateFileContentEvent.subscribe.mockImplementation(() => {
      updateFileContentSubscribe();
      return { unsubscribe: updateFileContentUnsubscribe };
    });

    wrapper = shallowMount(MonacoEditor, {
      props: {
        projectName: 'project-00000000',
        file: {
          id: 'file.js',
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

    describe('Test props: file', () => {
      it('should be an Object with id', () => {
        expect(wrapper.vm.props.file).toEqual({ id: 'file.js' });
      });
    });
  });

  describe('Test function: updateFile', () => {
    it('should call writeProjectFile and emit UpdateEditorContentEvent', async () => {
      await wrapper.vm.updateFile();
      expect(writeProjectFileMock).toHaveBeenCalledTimes(1);
      expect(FileEvent.UpdateEditorContentEvent.next).toBeCalledWith('file.js');
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

    it('should init editor if editor is null', async () => {
      wrapper.vm.editor = null;
      wrapper.vm.container = {
        offsetHeight: 10,
        offsetWidth: 11,
      };

      await wrapper.vm.updateEditorLayout();
      expect(wrapper.vm.editor).not.toBeNull();
    });
  });

  describe('Test function: updateEditorContentFromFiles', () => {
    it('should not call setValue without files', async () => {
      await wrapper.vm.updateEditorContentFromFiles([]);

      expect(setValue).not.toHaveBeenCalled();
    });

    it('should call setValue with valid file', async () => {
      await wrapper.vm.updateEditorContentFromFiles([
        new FileInput({
          path: 'file.js',
          content: 'test',
        }),
      ]);

      expect(setValue).toHaveBeenCalled();
    });
  });

  describe('Test function: updateEditorContent', () => {
    it('should call setValue', async () => {
      await wrapper.vm.updateEditorContent();

      expect(setValue).toHaveBeenCalled();
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to CheckoutEvent', () => {
      expect(checkoutSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to AddRemoteEvent', () => {
      expect(addRemoteSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to PullEvent', () => {
      expect(pullSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to UpdateFileContentEvent', () => {
      expect(updateFileContentSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to CheckoutEvent', () => {
      expect(checkoutUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(checkoutUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to AddRemoteEvent', () => {
      expect(addRemoteUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(addRemoteUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to PullEvent', () => {
      expect(pullUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(pullUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to UpdateFileContentEvent', () => {
      expect(updateFileContentUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(updateFileContentUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
