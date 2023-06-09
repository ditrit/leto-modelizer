import { shallowMount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import DialogEvent from 'src/composables/events/DialogEvent';
import DiagramTableActionMenu from 'components/menu/DiagramTableActionMenu';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  DialogEvent: {
    next: jest.fn(),
  },
}));

describe('Test component: DiagramTableActionMenu', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DiagramTableActionMenu, {
      props: {
        diagram: { name: 'diagramName', plugin: 'pluginName' },
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: diagram', () => {
      it('should match diagram', () => {
        expect(wrapper.vm.diagram).toStrictEqual({ name: 'diagramName', plugin: 'pluginName' });
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: renameDiagram', () => {
      it('should call dialog event and menu.hide function', () => {
        DialogEvent.next = jest.fn(() => Promise.resolve({
          type: 'open',
          key: 'RenameModel',
          model: wrapper.vm.diagram,
        }));
        wrapper.vm.menu = {
          hide: jest.fn(),
        };

        wrapper.vm.renameDiagram();

        expect(DialogEvent.next).toBeCalled();
        expect(wrapper.vm.menu.hide).toBeCalled();
      });
    });

    describe('Test function: deleteDiagram', () => {
      it('should call dialog event and menu.hide function', () => {
        DialogEvent.next = jest.fn(() => Promise.resolve({
          type: 'open',
          key: 'DeleteModel',
          model: wrapper.vm.diagram,
        }));
        wrapper.vm.menu = {
          hide: jest.fn(),
        };

        wrapper.vm.deleteDiagram();

        expect(DialogEvent.next).toBeCalled();
        expect(wrapper.vm.menu.hide).toBeCalled();
      });
    });
  });
});
