import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import ModelizerNavigationBar from 'src/components/ModelizerNavigationBar.vue';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';

installQuasarPlugin();

jest.mock('src/composables/events/ViewSwitchEvent', () => ({
  next: jest.fn(),
}));

describe('Test component: ModelizerNavigationBar', () => {
  let wrapper;
  const emit = jest.fn();

  ViewSwitchEvent.next.mockImplementation(() => emit());

  beforeEach(() => {
    wrapper = shallowMount(ModelizerNavigationBar, {
      props: {
        viewType: 'model',
        projectName: 'projectTest',
      },
      mocks: {
        ViewSwitchEvent,
      },
      global: {
        components: {
          'router-link': 'a',
        },
        plugins: [
          createI18n({
            locale: 'en-US',
            messages: {
              'en-US': {
                page: {
                  modelizer: {
                    header: {
                      switch: {
                        model: 'Model',
                        text: 'Text',
                      },
                    },
                  },
                },
              },
            },
          }),
        ],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test props: viewType', () => {
      it('should match "model"', () => {
        expect(wrapper.vm.props.viewType).toEqual('model');
      });
    });

    describe('Test props: projectName', () => {
      it('should match "projectTest"', () => {
        expect(wrapper.vm.props.projectName).toEqual('projectTest');
      });
    });

    describe('Test ref: buttonToggleValue', () => {
      it('should match "model"', () => {
        expect(wrapper.vm.props.viewType).toEqual('model');
      });
    });
  });

  describe('Test functions: onViewSwitchUpdate', () => {
    it('should not emit when newViewType is equal to props.viewType', () => {
      expect(emit).not.toHaveBeenCalled();
      wrapper.vm.onViewSwitchUpdate('model');
      expect(emit).not.toHaveBeenCalled();
    });

    it('should emit when newViewType is not equal to props.viewType', () => {
      expect(emit).not.toHaveBeenCalled();
      wrapper.vm.onViewSwitchUpdate('text');
      expect(emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test watcher: props.viewType', () => {
    it('should be trigger when props.viewType is update with a different value', async () => {
      await wrapper.setProps({
        viewType: 'text',
        projectName: 'projectTest',
      });
      expect(wrapper.vm.buttonToggleValue).toEqual('text');
    });
  });
});
