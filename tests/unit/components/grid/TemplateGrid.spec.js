import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import TemplateGrid from 'src/components/grid/TemplateGrid.vue';
import { createI18n } from 'vue-i18n';
import i18nConfiguration from 'src/i18n';
import { getTemplatesByType } from 'src/services/TemplateService';

installQuasarPlugin();

jest.mock('src/composables/Filter', () => ({
  searchText: jest.fn(() => true),
}));

jest.mock('vue-simple-acl', () => ({
  useAcl: () => ({
    role(key) {
      return key === 'create-project-from-template';
    },
  }),
}));

jest.mock('src/services/TemplateService', () => ({
  getTemplatesByType: jest.fn(() => Promise.resolve({
    content: [{ id: 'id_1' }],
    pageable: {
      pageNumber: 0,
      pageSize: 5,
    },
    totalElements: 1,
  })),
}));

describe('Test component: TemplateGrid', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TemplateGrid, {
      props: {
        type: 'PROJECT',
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

  describe('Test function : loadTemplates', () => {
    it('should not load templates without valid role', async () => {
      getTemplatesByType.mockClear();
      await wrapper.setProps({ type: 'DIAGRAM' });
      await wrapper.vm.loadTemplates({ pagination: null });

      expect(getTemplatesByType).not.toBeCalled();
      expect(wrapper.vm.templates).toEqual([]);
    });

    it('should not load templates without valid role', async () => {
      getTemplatesByType.mockClear();
      wrapper.vm.loading = true;
      await wrapper.setProps({ type: 'PROJECT' });
      await wrapper.vm.loadTemplates({
        pagination: {
          page: 0,
          rowsPerPage: 5,
        },
      });

      expect(getTemplatesByType).toBeCalled();
      expect(wrapper.vm.templates).toEqual([{
        id: 'id_1',
      }]);
      expect(wrapper.vm.pagination).toEqual({
        page: 1,
        rowsNumber: 1,
        rowsPerPage: 5,
      });
      expect(wrapper.vm.loading).toEqual(false);
    });
  });
});
