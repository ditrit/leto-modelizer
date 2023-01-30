import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import AttributeSection from 'src/components/panel/AttributeSection.vue';
import {
  ComponentAttribute,
} from 'leto-modelizer-plugin-core';

installQuasarPlugin();

describe('test component: AttributeSection', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AttributeSection, {
      props: {
        plugin: {},
        attribute: {
          name: 'attribute',
          type: 'String',
          value: '',
        },
        isRoot: true,
      },
    });
  });

  describe('Test computed: isObject', () => {
    it('should be false when attribute is not an object', () => {
      expect(wrapper.vm.isObject).toEqual(false);
    });

    it('should be true when attribute is an object', async () => {
      await wrapper.setProps({
        attribute: {
          name: 'attribute',
          type: 'Object',
          value: [],
        },
      });
      expect(wrapper.vm.isObject).toEqual(true);
    });
  });

  describe('Test watcher: props.attribute', () => {
    it('should update localAttribute', async () => {
      expect(wrapper.vm.localAttribute).toEqual({
        name: 'attribute',
        type: 'String',
        value: '',
      });
      expect(wrapper.vm.isObject).toEqual(false);

      await wrapper.setProps({
        attribute: {
          name: 'test',
          type: 'Object',
          value: [],
        },
      });
      expect(wrapper.vm.localAttribute).toEqual({
        name: 'test',
        type: 'Object',
        value: [],
      });
    });
  });

  describe('Test function: getSubAttributes', () => {
    const defaultAttribute = {
      name: 'test',
      type: 'String',
    };

    it('should return empty attributes array on attribute without definition and attribute value array is empty', () => {
      expect(wrapper.vm.getSubAttributes({
        value: [],
        definition: null,
      })).toEqual([]);
    });

    it('should return an array with instantiate defined attribute with its value even if attribute value array is empty', () => {
      expect(wrapper.vm.getSubAttributes({
        value: [],
        definition: {
          definedAttributes: [{
            ...defaultAttribute,
          }],
        },
      })).toEqual([new ComponentAttribute({
        ...defaultAttribute,
        definition: {
          ...defaultAttribute,
        },
      })]);
    });

    it('should return an array with instantiate defined attribute with its value even if attribute value is defined in the value array', () => {
      expect(wrapper.vm.getSubAttributes({
        value: [{
          ...defaultAttribute,
          value: 'toto',
          definition: {
            ...defaultAttribute,
          },
        }],
        definition: {
          definedAttributes: [{
            ...defaultAttribute,
          }],
        },
      })).toEqual([new ComponentAttribute({
        ...defaultAttribute,
        value: 'toto',
        definition: {
          ...defaultAttribute,
        },
      })]);
    });

    it('should return array with instantiate attribute with its value even if definition does not exist', () => {
      expect(wrapper.vm.getSubAttributes({
        value: [{
          ...defaultAttribute,
          value: 'toto',
        }],
      })).toEqual([{
        ...defaultAttribute,
        value: 'toto',
      }]);
    });
  });

  describe('Test function: addSubAttribute', () => {
    it('should emit event', async () => {
      await wrapper.setProps({
        attribute: {
          name: 'test',
          type: 'Object',
          value: [],
        },
      });
      wrapper.vm.addSubAttribute();
      expect(wrapper.emitted()['update:attribute']).toEqual([[{
        name: 'test',
        attribute: {
          name: 'test',
          type: 'Object',
          value: [{
            name: 'attribute_1',
            type: 'String',
            value: '',
            definition: null,
          }],
        },
      }]]);
    });
  });

  describe('Test function: deleteAttribute', () => {
    it('should emit event', () => {
      wrapper.vm.deleteAttribute();
      expect(wrapper.emitted()['update:attribute']).toEqual([[{
        name: 'attribute',
      }]]);
    });
  });

  describe('Test function: updateAttributeName', () => {
    it('should emit event', () => {
      wrapper.vm.updateAttributeName('test');
      expect(wrapper.emitted()['update:attribute']).toEqual([[{
        name: 'attribute',
        attribute: {
          name: 'test',
          type: 'String',
          value: '',
        },
      }]]);
    });
  });

  describe('Test function: updateAttributeValue', () => {
    it('should emit event', () => {
      wrapper.vm.updateAttributeValue('test');
      expect(wrapper.emitted()['update:attribute']).toEqual([[{
        name: 'attribute',
        attribute: {
          name: 'attribute',
          type: 'String',
          value: 'test',
        },
      }]]);
    });
  });

  describe('Test function: updateAttribute', () => {
    const defaultAttribute = {
      name: 'attribut_1',
      value: '',
      definition: null,
      type: 'String',
    };

    it('should remove attribute when call function with event without attribute', async () => {
      await wrapper.setProps({
        attribute: {
          name: 'test',
          value: [{
            ...defaultAttribute,
          }],
        },
      });

      wrapper.vm.updateAttribute({ name: 'attribut_1' });

      expect(wrapper.emitted()['update:attribute']).toEqual([[{
        name: 'test',
        attribute: {
          name: 'test',
          value: [],
        },
      }]]);
    });

    it('should update attribute value when call function with event with existing attribute name', async () => {
      const defaultAttribute2 = {
        name: 'attribut_2',
        value: 'test',
        definition: null,
        type: 'String',
      };

      await wrapper.setProps({
        attribute: {
          name: 'test',
          value: [{
            ...defaultAttribute,
          }],
        },
      });

      wrapper.vm.updateAttribute({
        name: 'attribut_1',
        attribute: {
          ...defaultAttribute2,
        },
      });

      expect(wrapper.emitted()['update:attribute']).toEqual([[{
        name: 'test',
        attribute: {
          name: 'test',
          value: [{
            ...defaultAttribute2,
          }],
        },
      }]]);
    });

    it('should add attribute value when call function with event with attribute name not existing', async () => {
      await wrapper.setProps({
        attribute: {
          name: 'test',
          value: [],
        },
      });

      wrapper.vm.updateAttribute({
        name: 'attribut_1',
        attribute: {
          ...defaultAttribute,
        },
      });

      expect(wrapper.emitted()['update:attribute']).toEqual([[{
        name: 'test',
        attribute: {
          name: 'test',
          value: [{
            ...defaultAttribute,
          }],
        },
      }]]);
    });
  });
});
