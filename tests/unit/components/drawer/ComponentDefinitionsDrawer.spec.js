import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ComponentDefinitionsDrawer from 'src/components/drawer/ComponentDefinitionsDrawer.vue';

installQuasarPlugin();

describe('Test component: ComponentDefinitionsDrawer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ComponentDefinitionsDrawer, {
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
        projectName: 'projectName',
      },
      global: {
        components: {
          'router-link': 'a',
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test computed: componentDefinitions', () => {
      it('should be an Object with plugin names as keys and corresponding definitions as value', () => {
        expect(wrapper.vm.componentDefinitions).toEqual([{
          type: 'componentType',
        }]);
      });
    });
  });

  describe('Test function: isMatching', () => {
    it('should return true when filter is null or empty', () => {
      expect(wrapper.vm.isMatching(null, 'test')).toBeTruthy();
      expect(wrapper.vm.isMatching('', 'test')).toBeTruthy();
    });
    it('should return true when filter is contained in value', () => {
      expect(wrapper.vm.isMatching('t', 'test')).toBeTruthy();
      expect(wrapper.vm.isMatching('t      est', 'test')).toBeTruthy();
    });
    it('should return false when filter is not contained in value', () => {
      expect(wrapper.vm.isMatching('a', 'test')).toBeFalsy();
    });
  });

  describe('Test function: scrollAreaHeight', () => {
    it('should should be a linear function ((Nkeys * 48) + 130)', () => {
      const keys = [];
      for (let i = 0; i < 10; i += 1) {
        const result = wrapper.vm.scrollAreaHeight(keys);
        expect(result).toEqual(130 + i * 48);
        keys.push(1);
      }
    });
  });
});
