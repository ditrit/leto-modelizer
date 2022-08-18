import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerSettingsMenu from 'src/components/menu/ModelizerSettingsMenu.vue';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

jest.mock('src/composables/events/DialogEvent', () => ({
  next: jest.fn(),
}));

describe('Test component: ModelizerNavigationBar', () => {
  let wrapper;
  const emit = jest.fn();

  DialogEvent.next.mockImplementation(() => emit());

  beforeEach(() => {
    wrapper = shallowMount(ModelizerSettingsMenu, {
      mocks: {
        DialogEvent,
      },
    });
  });

  describe('Test functions: onClick', () => {
    it('should emit an event', () => {
      expect(emit).not.toHaveBeenCalled();
      wrapper.vm.onClick();
      expect(emit).toBeCalled();
    });
  });
});
