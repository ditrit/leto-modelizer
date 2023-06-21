import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ProjectLayout from 'src/layouts/ProjectLayout.vue';
import { useRoute } from 'vue-router';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(() => []),
}));

jest.mock('src/composables/Project', () => ({
  gitGlobalUpload: jest.fn(),
  getProjectById: jest.fn(() => ({})),
}));

describe('Test page component: ProjectLayout', () => {
  let wrapper;

  const global = {
    plugins: [
      createI18n({ locale: 'en-US', messages: i18nConfiguration }),
    ],
    components: {
      'router-link': 'a',
    },
    stubs: [
      'router-view',
    ],
  };

  describe('Test computed: viewType', () => {
    it('should match route.params.projectName', () => {
      useRoute.mockImplementation(() => ({
        params: {
          projectName: 'test',
        },
      }));

      wrapper = shallowMount(ProjectLayout, {
        global,
      });

      expect(wrapper.vm.projectName).toEqual('test');
    });
  });
});
