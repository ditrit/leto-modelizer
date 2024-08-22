import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import VariableList from 'src/components/list/VariableList.vue';
import { Variable } from '@ditrit/leto-modelizer-plugin-core';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

describe('Test component: VariableList', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(VariableList, {
      props: {
        variables: [
          new Variable({ name: 'variable1' }),
          new Variable({ name: 'variable2' }),
        ],
      },
    });
  });

  describe('Test variables initialization', () => {
    describe('Test prop: variables', () => {
      it('should match an array containing 2 variables', () => {
        expect(wrapper.vm.variables).toEqual([
          new Variable({ name: 'variable1' }),
          new Variable({ name: 'variable2' }),
        ]);
      });
    });

    describe('Test computed: columns', () => {
      it('should be a list of objects with "name", "label" and "field" as keys and corresponding data as values', () => {
        expect(wrapper.vm.columns).toEqual([
          {
            name: 'name',
            label: 'page.modelizer.drawer.variables.name',
            field: 'name',
          },
          {
            name: 'value',
            label: 'page.modelizer.drawer.variables.value',
            field: 'value',
          },
        ]);
      });
    });
  });

  describe('Test function: getFormattedVariables', () => {
    it('should transform variables into the desired formatted object', () => {
      const variables = [
        {
          path: 'infra/new_file.tf',
          category: 'variable',
          name: 'instance_class',
          value: null,
        },
        {
          path: 'infra/new_file.tf',
          category: 'output',
          name: 'instance_ip_addr',
          value: 'aws_instance.server.private_ip',
        },
        {
          path: 'test/variable.tf',
          category: 'variable',
          name: 'image.id',
          value: 'var.image_id',
        },
      ];

      const expectedOutput = {
        'infra/new_file.tf': {
          variable: [
            {
              path: 'infra/new_file.tf',
              category: 'variable',
              name: 'instance_class',
              value: null,
            },
          ],
          output: [
            {
              path: 'infra/new_file.tf',
              category: 'output',
              name: 'instance_ip_addr',
              value: 'aws_instance.server.private_ip',
            },
          ],
        },
        'test/variable.tf': {
          variable: [
            {
              path: 'test/variable.tf',
              category: 'variable',
              name: 'image.id',
              value: 'var.image_id',
            },
          ],
        },
      };

      const result = wrapper.vm.getFormattedVariables(variables);

      expect(result).toEqual(expectedOutput);
    });
  });
});
