import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerDrawLeftDrawer from 'src/components/drawer/ModelizerDrawLeftDrawer.vue';

installQuasarPlugin();

describe('Test component: ModelizerDrawLeftDrawer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ModelizerDrawLeftDrawer, {
      props: {
        projectName: 'projectName',
        templates: [],
        plugin: {
          name: 'pluginName',
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: projectName', () => {
      it('should match "projectName"', () => {
        expect(wrapper.vm.projectName).toEqual('projectName');
      });
    });

    describe('Test prop: templates', () => {
      it('should be equal to an empty array', () => {
        expect(wrapper.vm.templates).toEqual([]);
      });
    });

    describe('Test prop: plugin', () => {
      it('should be an object with name', () => {
        expect(wrapper.vm.plugin).toEqual({ name: 'pluginName' });
      });
    });

    describe('Test variable: isVisible', () => {
      it('should be true', () => {
        expect(wrapper.vm.isVisible).toEqual(true);
      });
    });

    describe('Test variable: active', () => {
      it('should match "components"', () => {
        expect(wrapper.vm.active).toEqual('components');
      });
    });

    describe('Test variable: splitterModel', () => {
      it('should match 15', () => {
        expect(wrapper.vm.splitterModel).toEqual(15);
      });
    });
  });
});
