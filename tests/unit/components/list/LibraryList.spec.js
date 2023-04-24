import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import LibraryList from 'src/components/list/LibraryList.vue';

installQuasarPlugin();

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
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
        templates: [{
          type: 'templateType',
        }],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test computed: pluginDefinitions', () => {
      it('should be a list of Object with "type" as key and "componentType" as value', () => {
        expect(wrapper.vm.pluginDefinitions).toEqual([{
          type: 'componentType',
        }]);
      });
    });

    describe('Test computed: templateDefinitions', () => {
      it('should be a list of Object with type as key and "templateType" as value', () => {
        expect(wrapper.vm.templateDefinitions).toEqual([{
          type: 'templateType',
        }]);
      });
    });

    describe('Test computed: isEmptyList', () => {
      it('should be true when pluginDefinitions and templateDefinitions are empty', async () => {
        await wrapper.setProps({
          plugin: {
            data: {
              name: 'pluginName',
              definitions: {
                components: [],
              },
            },
          },
          templates: [],
        });

        expect(wrapper.vm.isEmptyList).toBeTruthy();
      });

      it('should be false when pluginDefinitions is not empty', async () => {
        await wrapper.setProps({
          templates: [],
        });

        expect(wrapper.vm.isEmptyList).toBeFalsy();
      });

      it('should be false when templateDefinitions is not empty', async () => {
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

        expect(wrapper.vm.isEmptyList).toBeFalsy();
      });
    });

    describe('Test computed: drawerItems', () => {
      it('should be a list of Object with "id", "title", "definitions", "size" as keys and corresponding data as values', () => {
        expect(wrapper.vm.drawerItems).toEqual([
          {
            id: 'pluginName',
            title: 'pluginName',
            definitions: [{ type: 'componentType' }],
            size: 1,
          },
          {
            id: 'page.modelizer.drawer.templates.title',
            title: 'page.modelizer.drawer.templates.title',
            definitions: [{ type: 'templateType' }],
            size: 1,
          },
        ]);
      });
    });
  });

  describe('Test function: onItemClick', () => {
    it('should invert isSelected value and set selectedItemId equals to the given parameter', () => {
      expect(wrapper.vm.isSelected).toBeTruthy();

      wrapper.vm.onItemClick();

      expect(wrapper.vm.isSelected).toBeFalsy();
      expect(wrapper.vm.selectedItemId).toBeNull();
    });

    it('should invert isSelected value and set selectedItemId to null', () => {
      wrapper.vm.isSelected = false;

      wrapper.vm.onItemClick('pluginName');

      expect(wrapper.vm.isSelected).toBeTruthy();
      expect(wrapper.vm.selectedItemId).toEqual('pluginName');
    });
  });
});
