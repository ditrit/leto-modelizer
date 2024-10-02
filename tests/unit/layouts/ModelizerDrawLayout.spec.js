import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { Notify } from 'quasar';
import { shallowMount } from '@vue/test-utils';
import ModelizerDrawLayout from 'src/layouts/ModelizerDrawLayout.vue';
import PluginManager from 'src/composables/PluginManager';
import LogEvent from 'src/composables/events/LogEvent';
import DrawerEvent from 'src/composables/events/DrawerEvent';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/events/DrawerEvent', () => ({
  subscribe: jest.fn(),
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

jest.mock('src/composables/events/LogEvent', () => ({
  FileLogEvent: {
    next: jest.fn(),
  },
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
  initComponents: jest.fn(() => Promise.resolve([])),
}));

describe('Test page component: ModelizerDrawLayout', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();

    DrawerEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(ModelizerDrawLayout, {});
  });

  describe('Test variables initialization', () => {
    describe('Test computed: projectName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.projectName).toEqual('project-00000000');
      });
    });

    describe('Test computed: diagramPath', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.diagramPath).toEqual('path');
      });
    });

    describe('Test computed: pluginName', () => {
      it('should match "project-00000000"', () => {
        expect(wrapper.vm.pluginName).toEqual('plugin');
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
  });

  describe('Test function: onDrawerEvent', () => {
    it('should only set reservedHeight on consoleFooter event', () => {
      wrapper.vm.splitterKey = null;
      wrapper.vm.onDrawerEvent({ key: 'ConsoleFooter', type: 'open' });
      expect(wrapper.vm.splitterKey).toEqual(null);
      expect(wrapper.vm.reservedHeight).toEqual(413);

      wrapper.vm.onDrawerEvent({ key: 'ConsoleFooter', type: 'close' });
      expect(wrapper.vm.splitterKey).toEqual(null);
      expect(wrapper.vm.reservedHeight).toEqual(37);
    });

    it('should set all variable event', () => {
      wrapper.vm.componentId = null;
      wrapper.vm.splitterKey = null;
      wrapper.vm.isVisible = false;
      wrapper.vm.splitter = 100;
      wrapper.vm.onDrawerEvent({ key: 'test', type: 'open', id: 'id_1' });
      expect(wrapper.vm.componentId).toEqual('id_1');
      expect(wrapper.vm.splitterKey).toEqual('test');
      expect(wrapper.vm.isVisible).toEqual(true);
      expect(wrapper.vm.splitter).toEqual(60);

      wrapper.vm.onDrawerEvent({ key: 'test2', type: 'close' });
      expect(wrapper.vm.componentId).toEqual(null);
      expect(wrapper.vm.splitterKey).toEqual('test2');
      expect(wrapper.vm.isVisible).toEqual(false);
      expect(wrapper.vm.splitter).toEqual(100);
    });
  });

  describe('Test function: initView', () => {
    it('should update data.plugin on success', async () => {
      await wrapper.vm.initView();

      expect(wrapper.vm.data.plugin).toEqual(expect.objectContaining({ data: expect.objectContaining({ name: 'pluginName' }) }));
      expect(LogEvent.FileLogEvent.next).toBeCalledWith([]);
    });

    it('should do nothing when there is no plugin', async () => {
      PluginManager.getPluginByName = jest.fn(() => null);

      Notify.create = jest.fn();

      await wrapper.vm.initView();

      expect(Notify.create).not.toHaveBeenCalled();
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe UpdateProjectEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe UpdateProjectEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
