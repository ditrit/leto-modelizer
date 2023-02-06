import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ModelizerModelView from 'src/components/ModelizerModelView.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import PluginManager from 'src/composables/PluginManager';
import TemplateManager from 'src/composables/TemplateManager';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/events/PluginEvent', () => ({
  InitEvent: {
    subscribe: jest.fn(),
  },
  ParseEvent: {
    subscribe: jest.fn(),
  },
  RenderEvent: {
    subscribe: jest.fn(),
  },
  DrawEvent: {
    subscribe: jest.fn(),
  },
}));

jest.mock('src/composables/PluginManager', () => ({
  getPlugins: jest.fn(),
  drawComponents: jest.fn(),
}));

jest.mock('src/composables/TemplateManager', () => ({
  getTemplatesByType: jest.fn(() => Promise.resolve([{ plugin: 'plugin', isTemplate: true }])),
}));

describe('Test component: ModelizerModelView', () => {
  let wrapper;
  let initSubscribe;
  let initUnsubscribe;
  let parseSubscribe;
  let parseUnsubscribe;
  let renderSubscribe;
  let renderUnsubscribe;
  let drawSubscribe;
  let drawUnsubscribe;

  beforeEach(() => {
    initSubscribe = jest.fn();
    initUnsubscribe = jest.fn();
    parseSubscribe = jest.fn();
    parseUnsubscribe = jest.fn();
    renderSubscribe = jest.fn();
    renderUnsubscribe = jest.fn();
    drawSubscribe = jest.fn();
    drawUnsubscribe = jest.fn();

    PluginEvent.InitEvent.subscribe.mockImplementation(() => {
      initSubscribe();
      return { unsubscribe: initUnsubscribe };
    });
    PluginEvent.ParseEvent.subscribe.mockImplementation(() => {
      parseSubscribe();
      return { unsubscribe: parseUnsubscribe };
    });
    PluginEvent.RenderEvent.subscribe.mockImplementation(() => {
      renderSubscribe();
      return { unsubscribe: renderUnsubscribe };
    });
    PluginEvent.DrawEvent.subscribe.mockImplementation(() => {
      drawSubscribe();
      return { unsubscribe: drawUnsubscribe };
    });

    PluginManager.getPlugins.mockImplementation(() => [{ data: { name: 'pluginName' } }]);
    PluginManager.drawComponents.mockImplementation(() => 'draw');

    wrapper = shallowMount(ModelizerModelView, {
      props: {
        projectName: 'project-00000000',
      },
    });
  });

  describe('Test function: updatePluginsAndTemplates', () => {
    it('should update data.plugins, call drawComponents and update component templates on success', async () => {
      await wrapper.vm.updatePluginsAndTemplates();

      expect(wrapper.vm.data.plugins).toEqual([{ data: { name: 'pluginName' } }]);
      expect(PluginManager.drawComponents).toBeCalled();
      expect(wrapper.vm.templates).toEqual([{ plugin: 'plugin', isTemplate: true }]);
    });

    it('should emit a negative notification on error after failing to retrieve templates', async () => {
      TemplateManager.getTemplatesByType.mockReturnValueOnce(Promise.reject());

      Notify.create = jest.fn();

      await wrapper.vm.updatePluginsAndTemplates();

      expect(Notify.create).toHaveBeenCalledWith({
        message: 'errors.templates.getData',
        html: true,
        type: 'negative',
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to InitEvent', () => {
      expect(initSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to ParseEvent', () => {
      expect(parseSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to DrawEvent', () => {
      expect(drawSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to RenderEvent', () => {
      expect(renderSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to InitEvent', () => {
      expect(initUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(initUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to ParseEvent', () => {
      expect(parseUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(parseUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to DrawEvent', () => {
      expect(drawUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(drawUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe to RenderEvent', () => {
      expect(renderUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(renderUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
