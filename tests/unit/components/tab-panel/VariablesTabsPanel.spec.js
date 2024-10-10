import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { shallowMount } from '@vue/test-utils';
import VariablesTabPanel from 'src/components/tab-panel/VariablesTabPanel.vue';

installQuasarPlugin();

jest.mock('vue-router', () => ({
  useRouter: jest.fn(),
  useRoute: jest.fn(() => ({
    query: {
      plugin: 'test',
    },
  })),
}));

jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (t) => t,
  }),
}));

jest.mock('src/composables/PluginManager', () => ({
  getPluginByName: jest.fn(() => ({
    data: {
      variables: [
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
      ],
    },
  })),
}));

describe('Test component: VariableList', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(VariablesTabPanel);
  });

  describe('Test variables initialization', () => {
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

      const result = wrapper.vm.getFormattedVariables();

      expect(result).toEqual(expectedOutput);
    });
  });
});
