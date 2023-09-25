import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import TemplateGrid from 'src/components/grid/TemplateGrid.vue';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';

installQuasarPlugin();

jest.mock('src/composables/Filter', () => ({
  searchText: jest.fn(() => true),
}));

describe('Test component: TemplateGrid', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TemplateGrid, {
      props: {
        templates: [{ type: 'Template1' }],
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

  describe('Test props initialization', () => {
    describe('Test prop: templates', () => {
      it('should match array of templates', () => {
        expect(wrapper.vm.templates).toStrictEqual([{ type: 'Template1' }]);
      });
    });
  });

  describe('Test computed: filteredTemplates', () => {
    it('should match props.templates', () => {
      expect(wrapper.vm.filteredTemplates).toEqual([{ type: 'Template1' }]);
    });
  });
});
