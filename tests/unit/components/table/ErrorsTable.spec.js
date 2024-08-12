import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import i18nConfiguration from 'src/i18n';
import ErrorsTable from 'src/components/table/ErrorsTable.vue';

installQuasarPlugin();

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
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

      expect(wrapper.vm.columns.length).toEqual(4);
      expect(wrapper.vm.columns[0].name).toEqual('severity');
      expect(wrapper.vm.columns[1].name).toEqual('component');
      expect(wrapper.vm.columns[2].name).toEqual('attribute');
      expect(wrapper.vm.columns[3].name).toEqual('message');
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
});
