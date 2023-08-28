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
    it('should equals columnsComputed', () => {
      const field = () => 'field';
      const columnsComputed = [
        {
          name: 'severity',
          align: 'left',
          label: 'footer.consoleFooter.errorsTable.severity',
          field: 'severity',
          style: 'width: 2rem',
        },
        {
          name: 'line',
          align: 'center',
          label: 'footer.consoleFooter.errorsTable.line',
          field,
          style: 'width: 2rem',
        },
        {
          name: 'column',
          align: 'center',
          label: 'footer.consoleFooter.errorsTable.column',
          field,
          style: 'width: 2rem',
        },
        {
          name: 'message',
          align: 'left',
          label: 'footer.consoleFooter.errorsTable.message',
          field: 'message',
        },
      ];

      expect(JSON.stringify(wrapper.vm.columns)).toEqual(JSON.stringify(columnsComputed));
    });
  });
});
