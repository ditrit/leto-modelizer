import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelsView from 'src/components/ModelsView.vue';
import UpdateModelEvent from 'src/composables/events/ModelEvent';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import DialogEvent from 'src/composables/events/DialogEvent';
import { useRoute, useRouter } from 'vue-router';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('src/composables/events/ModelEvent', () => ({
  subscribe: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  getAllModels: jest.fn(() => Promise.resolve([{
    name: 'Model',
    tags: ['a'],
  }])),
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplatesByType: jest.fn(() => Promise.resolve(['models'])),
}));

describe('Test component: ModelsView', () => {
  let wrapper;
  let updateModelSubscribe;
  let updateModelUnsubscribe;
  const useRouterPush = jest.fn();

  beforeEach(() => {
    updateModelSubscribe = jest.fn();
    updateModelUnsubscribe = jest.fn();

    useRoute.mockImplementation(() => ({
      params: {
        projectName: 'projectName',
        viewType: 'models',
      },
    }));

    useRouter.mockImplementation(() => ({
      push: useRouterPush,
    }));

    UpdateModelEvent.subscribe.mockImplementation(() => {
      updateModelSubscribe();
      return { unsubscribe: updateModelUnsubscribe };
    });

    wrapper = shallowMount(ModelsView, {
      props: {
        projectName: 'projectName',
      },
      global: {
        components: {
          'router-link': 'a',
        },
        plugins: [
          createI18n({
            locale: 'en-US',
            messages: i18nConfiguration,
          }),
        ],
      },
    });
  });

  describe('Test props: projectName', () => {
    it('should match "projectName"', () => {
      expect(wrapper.vm.projectName).toEqual('projectName');
    });
  });

  describe('Test computed: viewType', () => {
    it('should match route.params.viewType', () => {
      expect(wrapper.vm.viewType).toEqual('models');
    });
  });

  describe('Test function: onDiagramClick', () => {
    it('should call router.push with the given diagram parameters', () => {
      const diagram = {
        plugin: 'pluginName',
        name: 'diagramName',
      };

      wrapper.vm.onDiagramClick(diagram);

      expect(useRouterPush).toBeCalledWith({
        name: 'modelizer',
        params: {
          viewType: 'draw',
          projectName: 'projectName',
        },
        query: {
          path: 'pluginName/diagramName',
        },
      });
    });
  });

  describe('Test function: updateModels', () => {
    it('should set data.models to an array with 1 element', async () => {
      await wrapper.vm.updateModels();

      expect(wrapper.vm.data.models.length).toEqual(1);
    });

    it('should filter and return an array with selected element on valid filter', async () => {
      wrapper.vm.searchDiagramText = 'mode';
      wrapper.vm.selectedTags = ['a'];

      await wrapper.vm.updateModels();

      expect(wrapper.vm.data.models.length).toEqual(1);
    });

    it('should filter and return an array without element on invalid filter', async () => {
      wrapper.vm.searchDiagramText = 'test';
      wrapper.vm.selectedTags = ['c'];

      await wrapper.vm.updateModels();

      expect(wrapper.vm.data.models.length).toEqual(0);
    });
  });

  describe('Test function: openImportModelTemplateDialog', () => {
    it('should emit DialogEvent', async () => {
      DialogEvent.next = jest.fn();

      await wrapper.vm.openImportModelTemplateDialog({});

      expect(DialogEvent.next).toBeCalledWith({
        type: 'open',
        key: 'ImportModelTemplate',
        template: {},
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should set templates with return value of getTemplatesByType', () => {
      expect(wrapper.vm.templates).toEqual(['models']);
    });

    it('should subscribe to UpdateModelEvent', () => {
      expect(updateModelSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to UpdateModelEvent', () => {
      expect(updateModelUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(updateModelUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
