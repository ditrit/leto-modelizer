import { getTree } from 'src/composables/FileExplorer';

describe('Test composable: FileExplorer', () => {
  describe('Test function: getTree', () => {
    it('Should manage one root file', () => {
      const input = [{ path: '/file.tf' }];
      const output = [
        {
          id: '/file.tf',
          label: 'file.tf',
          icon: 'fa-regular fa-file',
          isFolder: false,
        },
      ];

      expect(getTree(input)).toStrictEqual(output);
    });

    it('Should manage two root files', () => {
      const input = [{ path: '/file1.tf' }, { path: '/file2.tf' }];
      const output = [
        {
          id: '/file1.tf',
          label: 'file1.tf',
          icon: 'fa-regular fa-file',
          isFolder: false,
        },
        {
          id: '/file2.tf',
          label: 'file2.tf',
          icon: 'fa-regular fa-file',
          isFolder: false,
        },
      ];

      expect(getTree(input)).toStrictEqual(output);
    });

    it('Should manage one file in one folder', () => {
      const input = [{ path: '/home/file.tf' }];
      const output = [
        {
          id: '/home',
          icon: 'fa-solid fa-folder',
          label: 'home',
          isFolder: true,
          children: [
            {
              id: '/home/file.tf',
              label: 'file.tf',
              icon: 'fa-regular fa-file',
              isFolder: false,
            },
          ],
        },
      ];

      expect(getTree(input)).toStrictEqual(output);
    });

    it('Should manage two files in one folder', () => {
      const input = [{ path: '/home/file1.tf' }, { path: '/home/file2.tf' }];
      const output = [
        {
          id: '/home',
          icon: 'fa-solid fa-folder',
          label: 'home',
          isFolder: true,
          children: [
            {
              id: '/home/file1.tf',
              label: 'file1.tf',
              icon: 'fa-regular fa-file',
              isFolder: false,
            },
            {
              id: '/home/file2.tf',
              label: 'file2.tf',
              icon: 'fa-regular fa-file',
              isFolder: false,
            },
          ],
        },
      ];

      expect(getTree(input)).toStrictEqual(output);
    });

    it('Should manage multiple files in multiple folders', () => {
      const input = [
        { path: '/user/plugin/file3.tf' },
        { path: '/home/folderA/file2.tf' },
        { path: '/home/folderA/subFolder/file1.tf' },
      ];
      const output = [
        {
          id: '/home',
          icon: 'fa-solid fa-folder',
          label: 'home',
          isFolder: true,
          children: [
            {
              id: '/home/folderA',
              label: 'folderA',
              icon: 'fa-solid fa-folder',
              isFolder: true,
              children: [
                {
                  id: '/home/folderA/subFolder',
                  label: 'subFolder',
                  icon: 'fa-solid fa-folder',
                  isFolder: true,
                  children: [
                    {
                      id: '/home/folderA/subFolder/file1.tf',
                      label: 'file1.tf',
                      icon: 'fa-regular fa-file',
                      isFolder: false,
                    },
                  ],
                },
                {
                  id: '/home/folderA/file2.tf',
                  label: 'file2.tf',
                  icon: 'fa-regular fa-file',
                  isFolder: false,
                },
              ],
            },
          ],
        },
        {
          id: '/user',
          icon: 'fa-solid fa-folder',
          label: 'user',
          isFolder: true,
          children: [
            {
              id: '/user/plugin',
              label: 'plugin',
              icon: 'fa-solid fa-folder',
              isFolder: true,
              children: [
                {
                  id: '/user/plugin/file3.tf',
                  label: 'file3.tf',
                  icon: 'fa-regular fa-file',
                  isFolder: false,
                },
              ],
            },
          ],
        },
      ];

      expect(getTree(input)).toStrictEqual(output);
    });

    it('Should manage empty tree', () => {
      expect(getTree([])).toStrictEqual([]);
    });
  });
});
