import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import FileExplorerActionCard from 'src/components/card/FileExplorerActionCard.vue';
import FileEvent from 'src/composables/events/FileEvent';

installQuasarPlugin();

jest.mock('src/composables/events/FileEvent', () => ({
  SelectNodeEvent: {
    next: jest.fn(() => Promise.resolve('SelectNodeEvent')),
  },
}));

describe('Test component: FileExplorerActionCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileExplorerActionCard, {
      props: {
        file: { id: 'test' },
      },
    });
  });

  describe('Test props initialization', () => {
    describe('Test prop: file', () => {
      it('should match file', () => {
        expect(wrapper.vm.file).toStrictEqual({ id: 'test' });
      });
    });
  });

  describe('Test functions', () => {
    describe('Test function: updateSelectedNode', () => {
      it('should set isActionMenuOpen and call SelectNodeEvent', () => {
        expect(wrapper.vm.isActionMenuOpen).toBe(false);

        wrapper.vm.updateSelectedNode();
        expect(wrapper.vm.isActionMenuOpen).toEqual(true);
        expect(FileEvent.SelectNodeEvent.next).toBeCalled();
      });
    });
  });
});
