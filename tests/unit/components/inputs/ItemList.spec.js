import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import ItemList from 'src/components/inputs/ItemList';

installQuasarPlugin();

describe('Test component: ItemList', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ItemList, {
      props: {
        item: {
          name: 'test_name',
          formattedName: 'var.test_name',
          type: 'item',
          value: ['test'],
          children: [],
        },
      },
      global: {
        stubs: {
          qSelect: true,
        },
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: item', () => {
      it('should be an object containing name, formattedName, type, value & children', () => {
        expect(wrapper.vm.item.name).toEqual('test_name');
        expect(wrapper.vm.item.formattedName).toEqual('var.test_name');
        expect(wrapper.vm.item.type).toEqual('item');
        expect(wrapper.vm.item.value).toEqual(['test']);
        expect(wrapper.vm.item.children).toEqual([]);
      });
    });
  });
});
