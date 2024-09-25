import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import CreateProjectTemplateDialog from 'src/components/dialog/CreateProjectTemplateDialog.vue';
import { useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import { directive as viewer } from 'v-viewer';
import { getTemplateSchema } from 'src/services/ImageDownloadService';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

jest.mock('src/composables/events/DialogEvent', () => ({
  subscribe: jest.fn(),
}));

jest.mock('src/services/ImageDownloadService', () => ({
  getTemplateSchema: jest.fn((env, template, index) => Promise.resolve(`schema_${index}`)),
}));

describe('Test component: CreateProjectTemplateDialog', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  const push = jest.fn();

  useRouter.mockImplementation(() => ({
    push,
  }));

  beforeEach(() => {
    subscribe = jest.fn();
    unsubscribe = jest.fn();

    DialogEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(CreateProjectTemplateDialog, {
      global: {
        plugins: [
          createI18n({ locale: 'en-US', messages: i18nConfiguration }),
        ],
        directives: {
          viewer,
        },
      },
    });
  });

  describe('Test function: addProject', () => {
    it('should emit an event and redirect to project model page', () => {
      DialogEvent.next = jest.fn();
      expect(DialogEvent.next).not.toHaveBeenCalled();

      wrapper.vm.addProject('test');

      expect(DialogEvent.next).toBeCalledWith({ type: 'close', key: 'CreateProjectTemplate' });
      expect(push).toBeCalledWith('/projects/test/models');
    });
  });

  describe('Test function: loadTemplateSchema', () => {
    it('should load schema', async () => {
      wrapper.vm.schemas = [null, null, null];
      await wrapper.vm.loadTemplateSchema(null, 1);
      expect(wrapper.vm.schemas).toEqual([null, 'schema_1', null]);

      wrapper.vm.schemas = [null, null, null];
      await wrapper.vm.loadTemplateSchema(null, 0);
      expect(wrapper.vm.schemas).toEqual(['schema_0', null, null]);
    });

    it('should set icon to null on error', async () => {
      wrapper.vm.schemas = ['0', '1', '2'];
      getTemplateSchema.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadTemplateSchema(null, 1);
      expect(wrapper.vm.schemas).toEqual(['0', null, '2']);

      await wrapper.vm.loadTemplateSchema(null, 0);
      expect(wrapper.vm.schemas).toEqual([null, null, '2']);
    });
  });

  describe('Test function: setProjectTemplate', () => {
    it('should set projectTemplate value on valid event type', async () => {
      expect(wrapper.vm.projectTemplate).toBeNull();
      expect(wrapper.vm.schemas).toEqual([]);

      await wrapper.vm.setProjectTemplate({
        key: 'CreateProjectTemplate',
        type: 'open',
        template: {
          id: 'id_1',
          schemas: ['schema1.svg', 'schema2.svg'],
        },
      });
      expect(wrapper.vm.projectTemplate).toEqual({
        id: 'id_1',
        schemas: ['schema1.svg', 'schema2.svg'],
      });
    });

    it('should not set projectTemplate on invalid event type', async () => {
      expect(wrapper.vm.projectTemplate).toBeNull();

      await wrapper.vm.setProjectTemplate({ key: 'InvalidEvent', type: 'open', template: 'test' });
      expect(wrapper.vm.projectTemplate).toBeNull();

      await wrapper.vm.setProjectTemplate({ key: 'CreateProjectTemplate', type: 'close', template: 'test' });
      expect(wrapper.vm.projectTemplate).toBeNull();
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe to DialogEvent', async () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe to DialogEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
