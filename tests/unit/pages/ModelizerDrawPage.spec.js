import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerDrawPage from 'src/pages/ModelizerDrawPage.vue';

installQuasarPlugin();
jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      projectName: 'project-00000000',
      viewType: 'model',
    },
    query: {
      path: 'path',
      plugin: 'plugin',
    },
  }),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: jest.fn(() => ({
    data: {
      name: 'pluginName',
      addComponent: jest.fn(),
      definitions: {
        components: [
          { type: 'testComponent', isTemplate: false, icon: 'icon' },
        ],
      },
    },
    draw: jest.fn(),
    arrangeComponentsPosition: jest.fn(() => Promise.resolve()),
    resetDrawerActions: jest.fn(),
  })),
  initComponents: jest.fn(() => Promise.resolve()),
  renderConfiguration: jest.fn(() => Promise.resolve()),
}));
describe('Test page component: ModelizerDrawPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ModelizerDrawPage);
  });

  describe('Test function: arrangeComponentsPosition', () => {
    it('should arrange a component position and redraw on click', async () => {
      await wrapper.vm.arrangeComponentsPosition();

      expect(wrapper.vm.data.plugin.arrangeComponentsPosition).toHaveBeenCalled();
      expect(wrapper.vm.data.plugin.draw).toHaveBeenCalledWith('root');
    });
  });
});
