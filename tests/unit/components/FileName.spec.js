import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import FileName from 'src/components/FileName.vue';

installQuasarPlugin();

describe('Test component: FileName', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileName, {
      props: {
        path: 'path',
        isActive: false,
        status: 'status',
        label: 'label',
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: path', () => {
      it('should match "path"', () => {
        expect(wrapper.vm.props.path).toEqual('path');
      });
    });

    describe('Test props: isActive', () => {
      it('should be false', () => {
        expect(wrapper.vm.props.isActive).toEqual(false);
      });
    });

    describe('Test props: status', () => {
      it('should match "status"', () => {
        expect(wrapper.vm.props.status).toEqual('status');
      });
    });

    describe('Test props: label', () => {
      it('should match "label"', () => {
        expect(wrapper.vm.props.label).toEqual('label');
      });
    });
  });

  describe('Test watcher: props.status', () => {
    it('should be triggered when props.status is updated', async () => {
      await wrapper.setProps({
        path: 'path',
        isActive: false,
        status: 'newStatus',
        label: 'label',
      });

      expect(wrapper.vm.fileStatus).toEqual('newStatus');
    });
  });
});
