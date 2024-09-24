import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import LibraryList from 'src/components/list/LibraryList.vue';

installQuasarPlugin();

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('vue-simple-acl', () => ({
  useAcl: () => ({
    role(key) {
      return key === 'create-component';
    },
  }),
}));

jest.mock('src/services/TemplateService', () => ({
  getTemplatesByType: jest.fn(() => Promise.resolve({
    content: [{
      name: 'test1',
    }],
    totalElements: 1,
    totalPages: 1,
    pageable: {
      pageNumber: 0,
    },
  })),
}));

describe('Test component: LibraryList', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(LibraryList, {
      global: {
        stubs: {
          qInput: true,
        },
      },
      props: {
        plugin: {
          data: {
            name: 'pluginName',
            definitions: {
              components: [{
                type: 'componentType',
              }],
            },
          },
        },
      },
    });
  });

  describe('Test computed: pluginDefinitions', () => {
    it('should be a list of Object with "type" as key and "componentType" as value', () => {
      expect(wrapper.vm.pluginDefinitions).toEqual([{
        type: 'componentType',
      }]);
    });
  });

  describe('Test computed: isEmptyList', () => {
    it('should be true when pluginDefinitions and templateDefinitions are empty', async () => {
      wrapper.vm.templates = [];
      await wrapper.setProps({
        plugin: {
          data: {
            name: 'pluginName',
            definitions: {
              components: [],
            },
          },
        },
      });

      expect(wrapper.vm.isEmptyList).toBeTruthy();
    });

    it('should be false when pluginDefinitions is not empty', async () => {
      wrapper.vm.templates = [];

      expect(wrapper.vm.pluginDefinitions).not.toEqual([]);
      expect(wrapper.vm.isEmptyList).toBeFalsy();
    });

    it('should be false when templates is not empty', async () => {
      await wrapper.setProps({
        plugin: {
          data: {
            name: 'pluginName',
            definitions: {
              components: [],
            },
          },
        },
      });

      expect(wrapper.vm.templates).not.toEqual([]);
      expect(wrapper.vm.isEmptyList).toBeFalsy();
    });
  });

  describe('Test computed: drawerItems', () => {
    it('should be a list of Object with "id", "title", "definitions", "size" as keys and corresponding data as values', () => {
      expect(wrapper.vm.drawerItems).toEqual([
        {
          id: 'pluginName',
          title: 'pluginName.displayName',
          definitions: [{ type: 'componentType' }],
          size: 1,
          hasRole: true,
        },
        {
          id: 'page.modelizer.drawer.templates.title',
          title: 'page.modelizer.drawer.templates.title',
          definitions: [{
            isTemplate: true,
            name: 'test1',
          }],
          size: 1,
          hasRole: false,
        },
      ]);
    });
  });

  describe('Test computed: hasRole', () => {
    it('should be false without selected item', () => {
      expect(wrapper.vm.selectedItemId).toBeNull();
      expect(wrapper.vm.hasRole).toEqual(false);
    });
    it('should be false with selected item without role', () => {
      wrapper.vm.selectedItemId = 'page.modelizer.drawer.templates.title';
      expect(wrapper.vm.hasRole).toEqual(false);
    });
    it('should be true with selected item and role', () => {
      wrapper.vm.selectedItemId = 'pluginName';
      expect(wrapper.vm.hasRole).toEqual(true);
    });
  });

  describe('Test function: onItemClick', () => {
    it('should invert isSelected value and set selectedItemId equals to the given parameter', () => {
      expect(wrapper.vm.isSelected).toBeFalsy();

      wrapper.vm.onItemClick('pluginName');

      expect(wrapper.vm.isSelected).toBeTruthy();
      expect(wrapper.vm.selectedItemId).toEqual('pluginName');
    });

    it('should invert isSelected value and set selectedItemId to null', () => {
      wrapper.vm.isSelected = true;

      wrapper.vm.onItemClick();

      expect(wrapper.vm.isSelected).toBeFalsy();
      expect(wrapper.vm.selectedItemId).toEqual(null);
    });
  });

  describe('Test function: loadTemplates', () => {
    it('should return templates', async () => {
      wrapper.vm.loading = true;

      const templates = await wrapper.vm.loadTemplates(0);

      expect(wrapper.vm.loading).toEqual(false);
      expect(templates).toEqual([{
        isTemplate: true,
        name: 'test1',
      }]);
    });
  });

  describe('Test function: initTemplates', () => {
    it('should set templates', async () => {
      wrapper.vm.templates = [];

      await wrapper.vm.initTemplates();

      expect(wrapper.vm.templates).toEqual([{
        isTemplate: true,
        name: 'test1',
      }]);
    });
  });

  describe('Test function: loadMoreTemplates', () => {
    it('should add more templates', async () => {
      wrapper.vm.templates = [];

      await wrapper.vm.initTemplates();

      expect(wrapper.vm.templates).toEqual([{
        isTemplate: true,
        name: 'test1',
      }]);

      await wrapper.vm.loadMoreTemplates();

      expect(wrapper.vm.templates).toEqual([{
        isTemplate: true,
        name: 'test1',
      }, {
        isTemplate: true,
        name: 'test1',
      }]);
    });
  });
});
