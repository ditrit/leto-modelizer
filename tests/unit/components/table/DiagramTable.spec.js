import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import i18nConfiguration from 'src/i18n';
import DiagramTable from 'src/components/table/DiagramTable.vue';

installQuasarPlugin();

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

describe('Test component: DiagramTable', () => {
  let wrapper;
  const { createI18n } = jest.requireActual('vue-i18n');

  beforeEach(() => {
    wrapper = shallowMount(DiagramTable, {
      global: {
        plugins: [
          createI18n({
            locale: 'en-US',
            messages: i18nConfiguration,
          }),
        ],
      },
      props: {
        diagrams: [{
          name: 'diagramName',
          plugin: 'pluginName',
          tags: ['1', '2', '3'],
          path: 'folder/pluginName/diagramName',
        }],
      },
    });
  });

  describe('Test computed: columns', () => {
    it('should equals columnsComputed', () => {
      const field = () => 'field';
      const columnsComputed = [
        {
          name: 'categories',
          align: 'left',
          label: 'page.models.table.categories',
          field,
        },
        {
          name: 'diagramPath',
          align: 'left',
          label: 'page.models.table.diagramPath',
          field,
          sortable: true,
        },
        {
          name: 'pluginIcon',
          align: 'left',
          label: 'page.models.table.plugin',
          field: 'pluginIcon',
        },
        {
          name: 'actions',
          label: '',
          field: 'actions',
        },
      ];

      expect(JSON.stringify(wrapper.vm.columns)).toEqual(JSON.stringify(columnsComputed));
    });
  });
});
