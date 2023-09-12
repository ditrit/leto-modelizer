import { initSelectOptions } from 'src/composables/InputManager';

jest.mock('src/composables/Project', () => ({
  getModelFiles: jest.fn(() => Promise.resolve([{ path: 'path', content: 'content' }])),
  writeProjectFile: jest.fn(() => Promise.resolve()),
  deleteProjectFile: jest.fn(() => Promise.resolve()),
  readProjectFile: jest.fn(() => Promise.resolve({ id: 'TEST' })),
  appendProjectFile: jest.fn(() => Promise.resolve()),
  readDir: jest.fn(() => Promise.resolve([])),
  isDirectory: jest.fn((path) => path === 'modelPath' || path === 'projectId/modelPath'),
}));

describe('Test composable: InputManager', () => {
  describe('Test function: initSelectOptions', () => {
    it('should generate select options correctly', () => {
      const variables = [
        {
          category: 'Category1', name: 'Name1', value: 1, formattedName: 'FormattedName1',
        },
        {
          category: 'Category2', name: 'Name2', value: null, defaultValue: 'Default1', formattedName: 'FormattedName2',
        },
        {
          category: 'Category1', name: 'Name3', value: 3, formattedName: 'FormattedName3',
        },
      ];

      const defaultValues = ['Default2', 'Default3'];

      const result = initSelectOptions(variables, defaultValues);

      const expectedOutput = [
        {
          type: 'category',
          name: 'plugin.component.attribute.selectInput.defaultValue',
          children: [
            { type: 'item', value: 'Default2' },
            { type: 'item', value: 'Default3' },
          ],
        },
        {
          type: 'category',
          name: 'plugin.component.attribute.selectInput.variables',
          children: [
            {
              type: 'category',
              name: 'Category1',
              children: [
                {
                  type: 'item',
                  name: 'Name1',
                  value: 1,
                  formattedName: 'FormattedName1',
                },
                {
                  type: 'item',
                  name: 'Name3',
                  value: 3,
                  formattedName: 'FormattedName3',
                },
              ],
            },
            {
              type: 'category',
              name: 'Category2',
              children: [
                {
                  type: 'item',
                  name: 'Name2',
                  value: 'Default1',
                  formattedName: 'FormattedName2',
                },
              ],
            },
          ],
        },
      ];

      expect(result).toEqual(expectedOutput);
    });
  });
});
