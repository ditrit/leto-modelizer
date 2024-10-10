import {
  getProjects,
  getProjectById,
  getProjectName,
  saveProject,
  deleteProjectById,
  initProject,
  getProjectFiles,
  readProjectFile,
  createProjectFolder,
  writeProjectFile,
  appendProjectFile,
  rmDir,
  rm,
  rename,
  deleteProjectDir,
  deleteProjectFile,
  deleteDiagramFile,
  PROJECT_STORAGE_KEY,
  getAllModels,
  getModelFiles,
  renameProject,
  isMatching,
  exists,
  extractProjectName,
} from 'src/composables/Project';
import {
  gitInit,
  gitAdd,
  gitCommit,
} from 'src/composables/Git';
import { FileInformation, FileInput } from '@ditrit/leto-modelizer-plugin-core';
import Project from 'src/models/Project';

jest.mock('browserfs', () => ({
  install: jest.fn(),
  configure: jest.fn(),
  BFSRequire: jest.fn(() => ({
    Buffer: {
      from: jest.fn(() => 'test'),
    },
    stat: jest.fn((path, cb) => {
      if (path === 'test'
        || path === 'test/parent'
        || path === 'test/emptyParent'
        || path === 'test/container'
        || path === 'test/container/parent'
        || path === 'test/container/emptyParent') {
        return cb(null, { isDirectory: () => true });
      }

      return cb(null, { isDirectory: () => false });
    }),
    readdir: jest.fn((path, cb) => {
      const files = [];

      if (path === 'empty/pluginName') {
        return cb(null);
      }
      if (path === 'test'
        || path === 'test/container') {
        files.push('parent');
        files.push('emptyParent');
      }

      if (path === 'test'
        || path === 'test/parent'
        || path === 'test/container/parent') {
        files.push('file.txt');
      }

      return cb(null, files);
    }),
    readFile: jest.fn((path, format, cb) => cb(null, 'test')),
    mkdir: jest.fn((path, cb) => cb(path === 'error' ? 'error' : undefined)),
    writeFile: jest.fn((path, content, _, cb) => cb(path === 'error' ? 'error' : undefined)),
    appendFile: jest.fn((path, content, _, cb) => cb(path === '/error' ? 'error' : undefined)),
    rmdir: jest.fn((path, cb) => {
      if (path === 'error') {
        return cb(true);
      }

      return cb(false);
    }),
    unlink: jest.fn((path, cb) => {
      if (path === 'error') {
        return cb(true);
      }

      return cb(false);
    }),
    rename: jest.fn((oldPath, newPath, cb) => {
      if (oldPath === newPath) {
        return cb('error');
      }
      return cb();
    }),
    exists: jest.fn((path, cb) => cb(true)),
  })),
}));

jest.mock('src/composables/PluginManager', () => ({
  getFileInputs: () => [],
  getPlugins: () => [],
  getPluginByName: jest.fn(() => ({
    isParsable: () => true,
    configuration: {
      isFolderTypeDiagram: true,
    },
  })),
}));

jest.mock('src/composables/Git', () => ({
  gitListFiles: () => [],
  gitRemove: () => Promise.resolve(),
  gitInit: jest.fn(() => Promise.resolve()),
  gitAdd: jest.fn(() => Promise.resolve()),
  gitCommit: jest.fn(() => Promise.resolve()),
}));

describe('Test composable: Project', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Test function: getProjects', () => {
    it('should return empty set', () => {
      const projects = getProjects();

      expect(projects).toBeDefined();
      expect(projects).toStrictEqual({});
    });

    it('should return saved projects', () => {
      const mockDate = Date.now();

      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => mockDate);

      const projects = {
        foo: new Project({ id: 'foo', creationDate: mockDate }),
        bar: new Project({ id: 'bar', creationDate: mockDate }),
        qaz: new Project({ id: 'qaz', creationDate: mockDate }),
        quz: new Project({ id: 'quz', creationDate: mockDate }),
      };

      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
      expect(getProjects()).toStrictEqual(projects);
    });
  });

  describe('Test function: getProjectById', () => {
    it('should not find a project', () => {
      const project = getProjectById('foo');

      expect(project).not.toBeDefined();
    });

    it('should return saved project', () => {
      const projects = { foo: { id: 'foo', creationDate: 1 } };

      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));

      const project = getProjectById('foo');

      expect(project).toStrictEqual(new Project({ id: 'foo', creationDate: 1 }));
    });
  });

  describe('Test function: getProjectName', () => {
    it('should return local project Name', () => {
      const projects = { foo: { id: 'foo' } };

      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));

      const projectName = getProjectName('foo');

      expect(projects.foo.git).not.toBeDefined();
      expect(projectName).toEqual('foo');
    });

    it('should return remote repository name', () => {
      const projects = { foo: { id: 'foo', git: { repository: 'https://github.com/my-project', username: 'test', token: 'test' } } };

      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));

      const projectName = getProjectName('foo');

      expect(projects.foo.git).toBeDefined();
      expect(projectName).toEqual('my-project');
    });
  });

  describe('Test function: saveProject', () => {
    let mockDate;

    beforeEach(() => {
      mockDate = Date.now();

      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => mockDate);
    });

    it('should save projects', () => {
      saveProject({ id: 'foo' });
      saveProject({ id: 'bar' });

      const projects = getProjects();

      expect(projects).toStrictEqual({
        foo: new Project({ id: 'foo', creationDate: mockDate }),
        bar: new Project({ id: 'bar', creationDate: mockDate }),
      });
    });

    it('should update project', () => {
      saveProject({
        id: 'foo',
        text: 'qaz',
        isFavorite: true,
        creationDate: 1,
      });

      const projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));

      expect(projects.foo).toStrictEqual({
        id: 'foo',
        text: 'qaz',
        creationDate: 1,
        isFavorite: true,
      });
    });
  });

  describe('Test function: initProject', () => {
    it('should init and create commit with default file', async () => {
      gitInit.mockResolvedValueOnce();
      gitAdd.mockResolvedValueOnce();
      gitCommit.mockResolvedValueOnce();

      await initProject({ id: 'foo' });

      expect(gitInit).toHaveBeenCalledWith('foo');
      expect(gitAdd).toHaveBeenCalledWith('foo', 'README.md');
      expect(gitCommit).toHaveBeenCalledWith('foo', 'Initial commit.');
    });
  });

  describe('Test function: deleteProjectById', () => {
    it('should delete one project', async () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        foo: { id: 'foo', creationDate: 1 },
        bar: { id: 'bar', creationDate: 1 },
      }));

      await deleteProjectById('foo');

      const projects = getProjects();

      expect(projects.bar).toStrictEqual(new Project({ id: 'bar', creationDate: 1 }));
      expect(projects.foo).not.toBeDefined();
    });
  });

  describe('Test function: createProjectFolder', () => {
    it('should return undefined when dir is created', async () => {
      const result = await createProjectFolder('goodPath');

      expect(result).toBeUndefined();
    });

    it('should return undefined when dir is created', async () => {
      const result = await createProjectFolder('a/b/c');

      expect(result).toBeUndefined();
    });

    it('should return an error when dir is not created', async () => {
      const error = await createProjectFolder('error').catch((e) => e);

      expect(error).toBeDefined();
    });
  });

  describe('Test function: writeProjectFile', () => {
    it('should succeed and return undefined', async () => {
      const result = await writeProjectFile({ path: 'goodPath', content: 'content' });

      expect(result).toBeUndefined();
    });

    it('should fail and return error', async () => {
      const error = await writeProjectFile({ path: 'error', content: 'content' }).catch((e) => e);

      expect(error).toBeDefined();
    });
  });

  describe('Test function: appendProjectFile', () => {
    it('should succeed and return undefined', async () => {
      const result = await appendProjectFile({ path: 'goodPath', content: 'content' });

      expect(result).toBeUndefined();
    });

    it('should fail and return error', async () => {
      const error = await appendProjectFile({ path: 'error', content: 'content' }).catch((e) => e);

      expect(error).toBeDefined();
    });

    it('should succeed with multiple folder and return undefined', async () => {
      const result = await appendProjectFile({ path: 'test/goodPath', content: 'content' }).catch((e) => e);

      expect(result).toBeUndefined();
    });
  });

  describe('Test function: getProjectFiles', () => {
    it('should return file information array', async () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        test: { id: 'test', git: {} },
      }));

      const result = await getProjectFiles('test');

      expect(result).toEqual([
        new FileInformation({ path: 'test/file.txt' }),
        new FileInformation({ path: 'test/emptyParent/__empty__' }),
        new FileInformation({ path: 'test/parent/file.txt' }),
      ]);
    });
  });

  describe('Test function: readProjectFile', () => {
    it('should return file input', async () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        test: { id: 'test', git: {} },
      }));

      const result = await readProjectFile(new FileInformation({ path: '/test/file.txt' }));

      expect(result).toEqual(new FileInput({ path: '/test/file.txt', content: 'test' }));
    });
  });

  describe('Test function: rmDir', () => {
    it('should be a success on good path', async () => {
      expect(await rmDir('ok')).toBeUndefined();
    });

    it('should be an error on bad path', async () => {
      expect(await rmDir('error').catch((e) => e)).toBeDefined();
    });
  });

  describe('Test function: rm', () => {
    it('should be a success on good path', async () => {
      expect(await rm('ok')).toBeUndefined();
    });

    it('should be an error on bad path', async () => {
      expect(await rm('error').catch((e) => e)).toBeDefined();
    });
  });

  describe('Test function: rename', () => {
    it('should be a success on good path', async () => {
      expect(await rename('path', 'newPath')).toBeUndefined();
    });

    it('should be an error on bad path', async () => {
      expect(await rename('error', 'error').catch((e) => e)).toBeDefined();
    });
  });

  describe('Test function: deleteProjectDir', () => {
    it('should be a success on good path', async () => {
      expect(await deleteProjectDir('test')).toBeUndefined();
    });

    it('should be an error on bad path', async () => {
      expect(await deleteProjectDir('error').catch((e) => e)).toBeDefined();
    });
  });

  describe(' Test function: deleteProjectFile', () => {
    it('should succeed', async () => {
      const result = await deleteProjectFile('test', 'container/parent').then(() => 'success');

      expect(result).toEqual('success');

      const result2 = await deleteProjectFile('test', 'test/container/parent').then(() => 'success');

      expect(result2).toEqual('success');
    });
  });

  describe(' Test function: deleteDiagramFile', () => {
    it('should succeed', async () => {
      const result = await deleteDiagramFile('test', 'container/parent').then(() => 'success');

      expect(result).toEqual('success');
    });
  });

  describe('Test function: getAllModels', () => {
    it('should return an empty array', async () => {
      expect(await getAllModels('test')).toEqual([]);
    });
  });

  describe('Test function: getModelFiles', () => {
    it('should return an array', async () => {
      let plugin = {
        configuration: {
          isFolderTypeDiagram: true,
        },
      };
      const array = await getModelFiles('projectName', '', plugin);

      expect(Array.isArray(array)).toBeTruthy();

      plugin = {
        configuration: {
          isFolderTypeDiagram: false,
        },
      };

      const array2 = await getModelFiles('projectName', 'modelPath', plugin);

      expect(Array.isArray(array2)).toBeTruthy();
    });
  });

  describe('Test function: renameProject', () => {
    it('should rename a project', async () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        foo: { id: 'foo', creationDate: 1 },
      }));

      await renameProject('foo', 'bar');

      const projects = getProjects();

      expect(projects.foo).not.toBeDefined();
      expect(projects.bar).toStrictEqual(new Project({ id: 'bar', creationDate: 1 }));
    });
  });

  describe('Test function: isMatching', () => {
    it('should return true when filter is null or empty', () => {
      expect(isMatching(null, 'test')).toBeTruthy();
      expect(isMatching('', 'test')).toBeTruthy();
    });
    it('should return true when filter is contained in value', () => {
      expect(isMatching('t', 'test')).toBeTruthy();
      expect(isMatching('t      est', 'test')).toBeTruthy();
    });
    it('should return false when filter is not contained in value', () => {
      expect(isMatching('a', 'test')).toBeFalsy();
    });
  });

  describe('Test function: exists', () => {
    it('should return true', async () => {
      const result = await exists();

      expect(result).toEqual(true);
    });
  });

  describe('Test function: extractProjectName', () => {
    it('should extract project name from the given url', () => {
      const url = 'https://github.com/ditrit/leto-modelizer';

      expect(extractProjectName(url)).toEqual('leto-modelizer');
    });

    it('should return null for invalid url format', () => {
      expect(extractProjectName('example.com')).toBeNull();
    });

    it('should return null when url is empty', () => {
      expect(extractProjectName('')).toBeNull();
    });

    it('should return project name when url end by /', () => {
      expect(extractProjectName('https://github.com/ditrit/leto-modelizer-project-test/')).toEqual('leto-modelizer-project-test');
    });

    it('should return project name when url end by .git', () => {
      expect(extractProjectName('https://github.com/ditrit/leto-modelizer-project-test.git')).toEqual('leto-modelizer-project-test');
    });

    it('should return project name when url end by .git/', () => {
      expect(extractProjectName('https://github.com/ditrit/leto-modelizer-project-test.git/')).toEqual('leto-modelizer-project-test');
    });
  });
});
