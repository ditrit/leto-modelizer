import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import i18nConfiguration from 'src/i18n';
import ErrorsTable from 'src/components/table/ErrorsTable.vue';
import PluginEvent from 'src/composables/events/PluginEvent';

installQuasarPlugin();

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/events/PluginEvent', () => ({
  RequestEvent: {
    next: jest.fn(),
  },
}));

describe('Test component: ErrorsTable', () => {
  let wrapper;
  const { createI18n } = jest.requireActual('vue-i18n');

  beforeEach(() => {
    wrapper = shallowMount(ErrorsTable, {
      global: {
        plugins: [
          createI18n({
            locale: 'en-US',
            messages: i18nConfiguration,
          }),
        ],
      },
      props: {
        errors: [{
          message: 'test message',
          startLine: 1,
          endLine: 2,
          startColumn: 3,
          endColumn: 4,
          severity: 'warning',
        }],
      },
    });
  });

  describe('Test computed: columns', () => {
    it('should have valid columns for diagram page', async () => {
      await wrapper.setProps({
        editorType: 'diagram',
      });

      expect(wrapper.vm.columns.length).toEqual(7);
      expect(wrapper.vm.columns[0].name).toEqual('severity');
      expect(wrapper.vm.columns[1].name).toEqual('component');
      expect(wrapper.vm.columns[2].name).toEqual('attribute');
      expect(wrapper.vm.columns[3].name).toEqual('file');
      expect(wrapper.vm.columns[4].name).toEqual('line');
      expect(wrapper.vm.columns[5].name).toEqual('column');
      expect(wrapper.vm.columns[6].name).toEqual('message');
    });

    it('should have valid columns for text page', async () => {
      await wrapper.setProps({
        editorType: 'text',
      });

      expect(wrapper.vm.columns.length).toEqual(4);
      expect(wrapper.vm.columns[0].name).toEqual('severity');
      expect(wrapper.vm.columns[1].name).toEqual('line');
      expect(wrapper.vm.columns[2].name).toEqual('column');
      expect(wrapper.vm.columns[3].name).toEqual('message');
    });
  });

  describe('Test function: selectComponent', () => {
    it('should emit events', () => {
      PluginEvent.RequestEvent.next.mockClear();

      wrapper.vm.selectComponent('id_1');

      expect(PluginEvent.RequestEvent.next).toHaveBeenCalledTimes(2);
      expect(PluginEvent.RequestEvent.next.mock.calls).toEqual([
        [{ type: 'select', ids: ['id_1'] }],
        [{ type: 'edit', id: 'id_1' }],
      ]);
    });
  });
});
