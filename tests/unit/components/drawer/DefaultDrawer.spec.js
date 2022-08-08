import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import DefaultDrawer from 'src/components/drawer/DefaultDrawer.vue';

installQuasarPlugin();

describe('Test component: DefaultDrawer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DefaultDrawer);
  });

  describe('Test drawer state', () => {
    describe('Test function: openDrawer', () => {
      it('Should open the drawer', () => {
        wrapper.vm.drawerMiniState = true;
        wrapper.vm.openDrawer({ stopPropagation: jest.fn() });
        expect(wrapper.vm.drawerMiniState).toBe(false);
      });
    });
  });
});
