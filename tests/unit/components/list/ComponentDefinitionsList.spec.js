import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ComponentDefinitionsList from 'src/components/list/ComponentDefinitionsList.vue';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRouter: jest.fn(),
}));

describe('Test component: ComponentDefinitionsList', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ComponentDefinitionsList, {
      props: {
        projectName: 'projectName',
        plugin: {
          name: 'pluginName',
        },
      },
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: projectName', () => {
      it('should match "projectName"', () => {
        expect(wrapper.vm.projectName).toEqual('projectName');
      });
    });

    describe('Test prop: plugin', () => {
      it('should be an object with name', () => {
        expect(wrapper.vm.plugin).toEqual({ name: 'pluginName' });
      });
    });
  });
});
