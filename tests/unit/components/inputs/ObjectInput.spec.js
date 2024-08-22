import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import { ComponentAttribute } from '@ditrit/leto-modelizer-plugin-core';
import ObjectInput from 'src/components/inputs/ObjectInput';

installQuasarPlugin();

describe('Test component: ObjectInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ObjectInput, {
      props: {
        attribute: {},
        plugin: {},
        fullName: 'root',
        component: {
          createAttribute: jest.fn(() => ({
            definition: {
              definition: {},
              name: 'definedAttributeMissing',
              type: 'type',
            },
            name: 'definedAttributeMissing',
            type: 'type',
            value: null,
          })),
        },
      },
    });
  });

  describe('Test function: getSubAttributes', () => {
    it('should return an empty array on attribute without value', () => {
      expect(wrapper.vm.getSubAttributes({})).toEqual([]);
    });

    it('should return an array of sub-attributes', () => {
      const attribute = {
        value: [{
          name: 'definedAttribute',
          definition: {},
        }, {
          name: 'undefinedAttribute',
        }],
        definition: {
          definedAttributes: [{
            name: 'definedAttribute',
          }, {
            name: 'definedAttributeMissing',
            type: 'type',
            definition: {},
          }],
        },
      };

      expect(wrapper.vm.getSubAttributes(attribute)).toEqual([{
        name: 'definedAttribute',
        definition: {},
      }, {
        ...(new ComponentAttribute({
          name: 'definedAttributeMissing',
          type: 'type',
          definition: {
            name: 'definedAttributeMissing',
            type: 'type',
            definition: {},
          },
        })),
      }, {
        name: 'undefinedAttribute',
      }]);
    });
  });

  describe('Test watcher: hasError.value', () => {
    it('should update expanded once', async () => {
      expect(wrapper.vm.expanded).toBeFalsy();

      await wrapper.setProps({
        attribute: {
          name: 'object',
        },
        plugin: {},
        fullName: 'root.object',
        currentError: 'root.object.child',
      });

      expect(wrapper.vm.expanded).toBeTruthy();

      await wrapper.setProps({
        attribute: {
          name: 'object',
        },
        plugin: {},
        fullName: 'root.object',
        currentError: 'root.object2.child',
      });

      expect(wrapper.vm.expanded).toBeTruthy();
    });
  });
});
