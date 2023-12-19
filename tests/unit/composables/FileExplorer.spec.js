import { getTree, updateFileInformation } from 'src/composables/FileExplorer';
import { isParsableFile } from 'src/composables/PluginManager';

jest.mock('src/composables/PluginManager', () => ({
  isParsableFile: jest.fn(() => false),
}));

describe('Test composable: FileExplorer', () => {
  describe('Test function: getTree', () => {
    it('should manage one root file', () => {
      const input = [{ path: 'my-project/file.tf' }];
      const tree = getTree('my-project', input);
      const output = [
        {
          id: 'my-project',
          icon: 'fa-solid fa-folder',
          label: 'my-project',
          isFolder: true,
          isRootFolder: true,
          hasParsableFiles: false,
          children: [
            {
              id: 'my-project/file.tf',
              label: 'file.tf',
              icon: 'fa-regular fa-file',
              isFolder: false,
              information: { path: 'my-project/file.tf' },
              isParsable: false,
            },
          ],
        }];

      expect(tree).toStrictEqual(output);
    });

    it('should manage two root files', () => {
      const input = [{ path: 'my-project/file1.tf' }, { path: 'my-project/file2.tf' }];
      const tree = getTree('my-project', input);
      const output = [
        {
          id: 'my-project',
          icon: 'fa-solid fa-folder',
          label: 'my-project',
          isFolder: true,
          isRootFolder: true,
          hasParsableFiles: false,
          children: [
            {
              id: 'my-project/file1.tf',
              label: 'file1.tf',
              icon: 'fa-regular fa-file',
              isFolder: false,
              information: { path: 'my-project/file1.tf' },
              isParsable: false,
            },
            {
              id: 'my-project/file2.tf',
              label: 'file2.tf',
              icon: 'fa-regular fa-file',
              isFolder: false,
              information: { path: 'my-project/file2.tf' },
              isParsable: false,
            },
          ],
        }];

      expect(tree).toStrictEqual(output);
    });

    it('should manage one file in one folder', () => {
      const input = [{ path: 'my-project/home/file.tf' }];
      const tree = getTree('my-project', input);
      const output = [
        {
          id: 'my-project',
          icon: 'fa-solid fa-folder',
          label: 'my-project',
          isFolder: true,
          isRootFolder: true,
          hasParsableFiles: false,
          children: [
            {
              id: 'my-project/home',
              icon: 'fa-solid fa-folder',
              label: 'home',
              isFolder: true,
              isRootFolder: false,
              hasParsableFiles: false,
              children: [
                {
                  id: 'my-project/home/file.tf',
                  label: 'file.tf',
                  icon: 'fa-regular fa-file',
                  isFolder: false,
                  information: { path: 'my-project/home/file.tf' },
                  isParsable: false,
                },
              ],
            },
          ],
        }];

      expect(tree).toStrictEqual(output);
    });

    it('should manage two files in one folder', () => {
      const input = [{ path: 'my-project/home/file1.tf' }, { path: 'my-project/home/file2.tf' }];
      const tree = getTree('my-project', input);
      const output = [
        {
          id: 'my-project',
          icon: 'fa-solid fa-folder',
          label: 'my-project',
          isFolder: true,
          isRootFolder: true,
          hasParsableFiles: false,
          children: [
            {
              id: 'my-project/home',
              icon: 'fa-solid fa-folder',
              label: 'home',
              isFolder: true,
              isRootFolder: false,
              hasParsableFiles: false,
              children: [
                {
                  id: 'my-project/home/file1.tf',
                  label: 'file1.tf',
                  icon: 'fa-regular fa-file',
                  isFolder: false,
                  information: { path: 'my-project/home/file1.tf' },
                  isParsable: false,
                },
                {
                  id: 'my-project/home/file2.tf',
                  label: 'file2.tf',
                  icon: 'fa-regular fa-file',
                  isFolder: false,
                  information: { path: 'my-project/home/file2.tf' },
                  isParsable: false,
                },
              ],
            },
          ],
        }];

      expect(tree).toStrictEqual(output);
    });

    it('should manage multiple files in multiple folders', () => {
      const input = [
        { path: 'my-project/user/plugin/file3.tf' },
        { path: 'my-project/home/folderA/file2.tf' },
        { path: 'my-project/home/folderA/subFolder/file1.tf' },
      ];
      const tree = getTree('my-project', input);
      const output = [
        {
          id: 'my-project',
          icon: 'fa-solid fa-folder',
          label: 'my-project',
          isFolder: true,
          isRootFolder: true,
          hasParsableFiles: false,
          children: [
            {
              id: 'my-project/home',
              icon: 'fa-solid fa-folder',
              label: 'home',
              isFolder: true,
              isRootFolder: false,
              hasParsableFiles: false,
              children: [
                {
                  id: 'my-project/home/folderA',
                  label: 'folderA',
                  icon: 'fa-solid fa-folder',
                  isFolder: true,
                  isRootFolder: false,
                  hasParsableFiles: false,
                  children: [
                    {
                      id: 'my-project/home/folderA/subFolder',
                      label: 'subFolder',
                      icon: 'fa-solid fa-folder',
                      isFolder: true,
                      isRootFolder: false,
                      hasParsableFiles: false,
                      children: [
                        {
                          id: 'my-project/home/folderA/subFolder/file1.tf',
                          label: 'file1.tf',
                          icon: 'fa-regular fa-file',
                          isFolder: false,
                          information: { path: 'my-project/home/folderA/subFolder/file1.tf' },
                          isParsable: false,
                        },
                      ],
                    },
                    {
                      id: 'my-project/home/folderA/file2.tf',
                      label: 'file2.tf',
                      icon: 'fa-regular fa-file',
                      isFolder: false,
                      information: { path: 'my-project/home/folderA/file2.tf' },
                      isParsable: false,
                    },
                  ],
                },
              ],
            },
            {
              id: 'my-project/user',
              icon: 'fa-solid fa-folder',
              label: 'user',
              isFolder: true,
              isRootFolder: false,
              hasParsableFiles: false,
              children: [
                {
                  id: 'my-project/user/plugin',
                  label: 'plugin',
                  icon: 'fa-solid fa-folder',
                  isFolder: true,
                  isRootFolder: false,
                  hasParsableFiles: false,
                  children: [
                    {
                      id: 'my-project/user/plugin/file3.tf',
                      label: 'file3.tf',
                      icon: 'fa-regular fa-file',
                      isFolder: false,
                      information: { path: 'my-project/user/plugin/file3.tf' },
                      isParsable: false,
                    },
                  ],
                },
              ],
            },
          ],
        }];

      expect(tree).toStrictEqual(output);
    });

    it('should manage one parsable file', () => {
      isParsableFile.mockImplementation(() => true);

      const input = [{ path: 'my-project/home/file.tf' }];
      const tree = getTree('my-project', input);
      const output = [
        {
          id: 'my-project',
          icon: 'fa-solid fa-folder',
          label: 'my-project',
          isFolder: true,
          isRootFolder: true,
          hasParsableFiles: true,
          children: [
            {
              id: 'my-project/home',
              icon: 'fa-solid fa-folder',
              label: 'home',
              isFolder: true,
              isRootFolder: false,
              hasParsableFiles: true,
              children: [
                {
                  id: 'my-project/home/file.tf',
                  label: 'file.tf',
                  icon: 'fa-regular fa-file',
                  isFolder: false,
                  information: { path: 'my-project/home/file.tf' },
                  isParsable: true,
                },
              ],
            },
          ],
        }];

      expect(tree).toStrictEqual(output);
    });

    it('should manage two parsable files', () => {
      isParsableFile.mockImplementation(({ path }) => path === 'my-project/home/file.tf' || path === 'my-project/user/file.tf');

      const input = [{ path: 'my-project/home/file.tf' }, { path: 'my-project/user/file.tf' }, { path: 'my-project/README.md' }];
      const tree = getTree('my-project', input);
      const output = [
        {
          id: 'my-project',
          icon: 'fa-solid fa-folder',
          label: 'my-project',
          isFolder: true,
          isRootFolder: true,
          hasParsableFiles: true,
          children: [
            {
              id: 'my-project/home',
              icon: 'fa-solid fa-folder',
              label: 'home',
              isFolder: true,
              isRootFolder: false,
              hasParsableFiles: true,
              children: [
                {
                  id: 'my-project/home/file.tf',
                  label: 'file.tf',
                  icon: 'fa-regular fa-file',
                  isFolder: false,
                  information: { path: 'my-project/home/file.tf' },
                  isParsable: true,
                },
              ],
            },
            {
              id: 'my-project/user',
              icon: 'fa-solid fa-folder',
              label: 'user',
              isFolder: true,
              isRootFolder: false,
              hasParsableFiles: true,
              children: [
                {
                  id: 'my-project/user/file.tf',
                  label: 'file.tf',
                  icon: 'fa-regular fa-file',
                  isFolder: false,
                  information: { path: 'my-project/user/file.tf' },
                  isParsable: true,
                },
              ],
            },
            {
              id: 'my-project/README.md',
              label: 'README.md',
              icon: 'fa-regular fa-file',
              isFolder: false,
              information: { path: 'my-project/README.md' },
              isParsable: false,
            },
          ],
        }];

      expect(tree).toStrictEqual(output);
    });

    it('should manage empty tree', () => {
      expect(getTree('my-project', [])).toStrictEqual([{
        id: 'my-project',
        icon: 'fa-solid fa-folder',
        label: 'my-project',
        isFolder: true,
        isRootFolder: true,
        hasParsableFiles: false,
        children: [],
      }]);
    });
  });

  describe('Test function: updateFileInformation', () => {
    it('should update status on first level', () => {
      const folder = {
        children: [
          { label: 'one.txt', information: null },
          { label: 'two.txt', information: null },
          { label: 'subFolder', children: [{ label: 'one.txt', information: null }] },
        ],
      };
      const fileStatus = { path: 'rootFolder/one.txt' };

      updateFileInformation(folder, fileStatus);

      expect(folder).toEqual({
        children: [
          { label: 'one.txt', information: { path: 'rootFolder/one.txt' } },
          { label: 'two.txt', information: null },
          { label: 'subFolder', children: [{ label: 'one.txt', information: null }] },
        ],
      });
    });

    it('should update status on second level', () => {
      const folder = {
        children: [
          { label: 'one.txt', information: null },
          { label: 'two.txt', information: null },
          { label: 'subFolder', children: [{ label: 'one.txt', information: null }] },
        ],
      };
      const fileStatus = { path: 'rootFolder/subFolder/one.txt' };

      updateFileInformation(folder, fileStatus);

      expect(folder).toEqual({
        children: [
          { label: 'one.txt', information: null },
          { label: 'two.txt', information: null },
          { label: 'subFolder', children: [{ label: 'one.txt', information: { path: 'rootFolder/subFolder/one.txt' } }] },
        ],
      });
    });

    it('should do nothing if new fileStatus is not found in folder', () => {
      const folder = {
        children: [
          { label: 'one.txt', information: null },
          { label: 'two.txt', information: null },
          { label: 'subFolder', children: [{ label: 'one.txt', information: null }] },
        ],
      };
      const fileStatus = { path: 'rootFolder/three.txt' };

      updateFileInformation(folder, fileStatus);

      expect(folder).toEqual({
        children: [
          { label: 'one.txt', information: null },
          { label: 'two.txt', information: null },
          { label: 'subFolder', children: [{ label: 'one.txt', information: null }] },
        ],
      });
    });
  });
});
