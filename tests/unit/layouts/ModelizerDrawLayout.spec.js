import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { Notify } from 'quasar';
import { shallowMount } from '@vue/test-utils';
import ModelizerDrawLayout from 'src/layouts/ModelizerDrawLayout.vue';
import PluginManager from 'src/composables/PluginManager';
import TemplateManager from 'src/composables/TemplateManager';

installQuasarPlugin({
  plugins: [Notify],
});

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
    __drawer: {
      actions: {
        zoom: {
          scale: 1,
          translate: { x: 0, y: 0 },
        },
      },
    },
    parse: jest.fn(),
    draw: jest.fn(),
  })),
  initComponents: jest.fn(() => Promise.resolve()),
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplatesByType: jest.fn(() => Promise.resolve([{ plugin: 'plugin', isTemplate: true }, {
    type: 'component one',
    isTemplate: true,
    files: ['app.tf'],
    key: 'testTemplate',
    plugin: 'pluginName',
  }])),
}));

describe('Test page component: ModelizerDrawLayout', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ModelizerDrawLayout, {});
  });

  describe('Test variables initialization', () => {
    describe('Test computed: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });

    describe('Test computed: query', () => {
      it('should be an object', () => {
        expect(wrapper.vm.query).toEqual({
          path: 'path',
          plugin: 'plugin',
        });
      });
    });

    describe('Test reactive: data', () => {
      it('should be an object', () => {
        expect(wrapper.vm.data.plugin).toEqual(expect.objectContaining({ data: expect.objectContaining({ name: 'pluginName' }) }));
      });
    });

    describe('Test ref: templates', () => {
      it('should be an object', () => {
        expect(wrapper.vm.templates).toEqual([{ plugin: 'plugin', isTemplate: true }, {
          type: 'component one',
          isTemplate: true,
          files: ['app.tf'],
          key: 'testTemplate',
          plugin: 'pluginName',
        }]);
      });
    });
  });

  describe('Test function: initView', () => {
    it('should update data.plugin and update component templates on success', async () => {
      await wrapper.vm.initView();

      expect(wrapper.vm.data.plugin).toEqual(expect.objectContaining({ data: expect.objectContaining({ name: 'pluginName' }) }));
      expect(wrapper.vm.templates).toEqual([{ plugin: 'plugin', isTemplate: true }, {
        type: 'component one',
        isTemplate: true,
        files: ['app.tf'],
        key: 'testTemplate',
        plugin: 'pluginName',
      }]);
    });

    it('should emit a negative notification on error after failing to retrieve templates', async () => {
      TemplateManager.getTemplatesByType.mockReturnValueOnce(Promise.reject());

      Notify.create = jest.fn();

      await wrapper.vm.initView();

      expect(Notify.create).toHaveBeenCalledWith({
        message: 'errors.templates.getData',
        html: true,
        type: 'negative',
      });
    });

    it('should do nothing when there is no plugin', async () => {
      PluginManager.getPluginByName = jest.fn(() => null);

      Notify.create = jest.fn();

      await wrapper.vm.initView();

      expect(Notify.create).not.toHaveBeenCalled();
    });
  });
});
