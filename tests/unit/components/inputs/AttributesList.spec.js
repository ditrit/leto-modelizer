import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import AttributesList from 'src/components/inputs/AttributesList';

installQuasarPlugin();

describe('Test component: AttributesList', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AttributesList, {
      props: {
        attributes: [],
        plugin: {},
        fullName: 'root',
        component: {},
      },
    });
  });

  describe('Test function: getNewAttributeName', () => {
    it('should return "attribute_1"', () => {
      expect(wrapper.vm.getNewAttributeName()).toEqual('attribute_1');
    });

    it('should return "attribute_2"', () => {
      wrapper.vm.data.localAttributes = [{
        name: 'attribute_1',
      }];

      expect(wrapper.vm.getNewAttributeName()).toEqual('attribute_2');
    });
  });

  describe('Test function: addAttribute', () => {
    it('should update attributes list and emit it', () => {
      wrapper.vm.addAttribute();

      expect(wrapper.emitted()['update:attributes'][0]).toEqual([{
        attributes: [{
          name: 'attribute_1',
          value: '',
          definition: null,
          type: 'String',
        }],
      }]);
    });
  });

  describe('Test function: updateAttributeName', () => {
    it('should update attributes list and emit it', () => {
      wrapper.vm.data.localAttributes = [{
        name: 'attribute_1',
        value: '',
        definition: null,
        type: 'String',
      }];

      wrapper.vm.updateAttributeName({
        attributeName: 'attribute_1',
        newName: 'attribute_2',
      });

      expect(wrapper.emitted()['update:attributes'][0]).toEqual([{
        attributes: [{
          name: 'attribute_2',
          value: '',
          definition: null,
          type: 'String',
        }],
      }]);
    });
  });

  describe('Test function: updateAttributeValue', () => {
    it('should update attributes list and emit it', () => {
      wrapper.vm.data.localAttributes = [{
        name: 'attribute_1',
        value: '',
        definition: null,
        type: 'String',
      }];

      wrapper.vm.updateAttributeValue({
        attributeName: 'attribute_1',
        newValue: 'test',
      });

      expect(wrapper.emitted()['update:attributes'][0]).toEqual([{
        attributes: [{
          name: 'attribute_1',
          value: 'test',
          definition: null,
          type: 'String',
        }],
      }]);
    });
  });

  describe('Test function: deleteAttribute', () => {
    it('should update attributes list and emit it', () => {
      const attribute = {
        name: 'attribute_1',
        value: '',
        definition: null,
        type: 'String',
      };
      wrapper.vm.data.localAttributes = [attribute];

      wrapper.vm.deleteAttribute({ attribute });

      expect(wrapper.emitted()['update:attributes'][0]).toEqual([{
        attributes: [],
      }]);
    });
  });

  describe('Test watcher: props.attributes', () => {
    it('should update data.localAttributes', async () => {
      expect(wrapper.vm.data.localAttributes).toEqual([]);

      await wrapper.setProps({
        attributes: [{
          name: 'attribute_1',
          value: '',
          definition: null,
          type: 'String',
        }],
        plugin: {},
        fullName: 'root',
      });

      expect(wrapper.vm.data.localAttributes).toEqual([{
        name: 'attribute_1',
        value: '',
        definition: null,
        type: 'String',
      }]);
    });
  });
});
