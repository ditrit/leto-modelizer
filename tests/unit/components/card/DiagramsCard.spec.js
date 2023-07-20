import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import DiagramsCard from 'src/components/card/DiagramsCard.vue';
import UpdateModelEvent from 'src/composables/events/ModelEvent';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
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
    path: 'Model',
    tags: [{
      type: 'category',
      value: 'a',
    }],
  }])),
}));

jest.mock('src/composables/PluginManager', () => ({
  getAllTagsByType: jest.fn(() => Promise.resolve([{
    type: 'category',
    value: 'a',
  }])),
}));

describe('Test component: DiagramsCard', () => {
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

    wrapper = shallowMount(DiagramsCard, {
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
      expect(wrapper.vm.props.projectName).toEqual('projectName');
    });
  });

  describe('Test computed', () => {
    describe('Test computed: viewType', () => {
      it('should match route.params.viewType', () => {
        expect(wrapper.vm.viewType).toEqual('models');
      });
    });
  });

  describe('Test function: switchDiagramType', () => {
    it('should toggle isDiagramGrid value', () => {
      expect(wrapper.vm.isDiagramGrid).toBeFalsy();

      wrapper.vm.switchDiagramType();

      expect(wrapper.vm.isDiagramGrid).toBeTruthy();

      wrapper.vm.switchDiagramType();

      expect(wrapper.vm.isDiagramGrid).toBeFalsy();
    });
  });

  describe('Test function: onDiagramClick', () => {
    it('should call router.push with the given diagram parameters', () => {
      const diagram = {
        plugin: 'pluginName',
        name: 'diagramName',
        path: 'diagramPath',
      };

      wrapper.vm.onDiagramClick(diagram);

      expect(useRouterPush).toBeCalledWith({
        name: 'Draw',
        params: {
          projectName: 'projectName',
        },
        query: {
          path: 'diagramPath',
          plugin: 'pluginName',
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

  describe('Test hook function: onMounted', () => {
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
