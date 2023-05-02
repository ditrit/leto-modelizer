import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerTextView from 'src/components/ModelizerTextView.vue';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import FileEvent from 'src/composables/events/FileEvent';
import { useRouter } from 'vue-router';

installQuasarPlugin();

jest.mock('src/composables/events/FileEvent', () => ({
  SelectFileTabEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('vue-router', () => ({
  useRoute: () => ({ query: { path: 'pluginName/modelName' } }),
  useRouter: jest.fn(),
}));

jest.mock('src/composables/Project', () => ({
  getAllModels: () => [{
    plugin: 'plugin',
    name: 'name',
  }],
}));

describe('Test component: ModelizerTextView', () => {
  let wrapper;
  let selectFileTabEventSubscribe;
  let selectFileTabEventUnsubscribe;
  let useRouterPush;

  beforeEach(() => {
    selectFileTabEventSubscribe = jest.fn();
    selectFileTabEventUnsubscribe = jest.fn();
    useRouterPush = jest.fn();

    useRouter.mockImplementation(() => ({
      push: useRouterPush,
    }));

    FileEvent.SelectFileTabEvent.subscribe.mockImplementation(() => {
      selectFileTabEventSubscribe();
      return { unsubscribe: selectFileTabEventUnsubscribe };
    });

    wrapper = shallowMount(ModelizerTextView, {
      props: {
        projectName: 'project-00000000',
      },
      global: {
        plugins: [
          createI18n({
            locale: 'en-US',
            messages: i18nConfiguration,
          }),
        ],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });

    describe('Test variable: showParsableFiles', () => {
      it('should be false', () => {
        expect(wrapper.vm.showParsableFiles).toEqual(false);
      });
    });
  });

  describe('Test function: getModel', () => {
    it('should return model corresponding to the selected file', async () => {
      process.env.MODELS_DEFAULT_FOLDER = '';
      const model = await wrapper.vm.getModel('plugin/name/filename');

      expect(model).toEqual({
        plugin: 'plugin',
        name: 'name',
      });
    });

    it('should return undefined if MODELS_DEFAULT_FOLDER is defined', async () => {
      process.env.MODELS_DEFAULT_FOLDER = 'test';
      const model = await wrapper.vm.getModel('plugin/name/filename');

      expect(model).toEqual(undefined);
    });

    it('should return undefined otherwise', async () => {
      const model = await wrapper.vm.getModel(null);

      expect(model).toEqual(undefined);
    });
  });

  describe('Test function: onSelectFileTab', () => {
    it('should only set selectedFileTabPath', async () => {
      await wrapper.vm.onSelectFileTab('pluginName/modelName/fileName');

      expect(useRouterPush).toHaveBeenCalledTimes(0);

      await wrapper.vm.onSelectFileTab(null);

      expect(useRouterPush).toHaveBeenCalledTimes(0);
    });

    it('should also call router.push()', async () => {
      process.env.MODELS_DEFAULT_FOLDER = '';

      await wrapper.vm.onSelectFileTab('notPlugin/fileName');

      expect(useRouterPush).toHaveBeenCalledTimes(1);
      expect(useRouterPush).toHaveBeenCalledWith({
        name: 'modelizer',
        params: {
          viewType: 'text',
          projectName: wrapper.vm.props.projectName,
        },
        query: {
          path: 'pluginName/modelName',
        },
      });

      await wrapper.vm.onSelectFileTab('plugin/name/fileName');

      expect(useRouterPush).toHaveBeenCalledTimes(2);
      expect(useRouterPush).toHaveBeenCalledWith({
        name: 'modelizer',
        params: {
          viewType: 'text',
          projectName: wrapper.vm.props.projectName,
        },
        query: {
          path: 'plugin/name',
        },
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to SelectFileTabEvent', () => {
      expect(selectFileTabEventSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to SelectFileTabEvent', () => {
      expect(selectFileTabEventUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(selectFileTabEventUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
