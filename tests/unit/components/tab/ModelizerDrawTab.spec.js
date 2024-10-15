import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerDrawTab from 'src/components/tab/ModelizerDrawTab.vue';
import { getPluginByName } from 'src/composables/PluginManager';

installQuasarPlugin();

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: jest.fn(() => 'plugin'),
}));

jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({
    query: {
      plugin: 'test',
    },
  })),
}));

describe('Test component: ModelizerDrawTab', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ModelizerDrawTab, {
      props: {
        offset: 100,
      },
    });
  });

  describe('Test function: onMounted', () => {
    it('should set plugin', () => {
      expect(wrapper.vm.plugin).toEqual('plugin');
      expect(getPluginByName).toBeCalledWith('test');
    });
  });
});
