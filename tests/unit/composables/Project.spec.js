import {
  getProjects,
  getProjectById,
  getProjectName,
  saveProject,
  deleteProjectById,
  initProject,
  getProjectFiles,
  readProjectFile,
  gitAddRemote,
  getCurrentBranch,
  gitFetch,
  getBranches,
  gitCheckout,
  createBranchFrom,
  gitUpdate,
  createProjectFolder,
  writeProjectFile,
  appendProjectFile,
  rmDir,
  rm,
  rename,
  deleteProjectDir,
  deleteProjectFile,
  getStatus,
  gitPush,
  gitAdd,
  gitCommit,
  gitLog,
  gitGlobalUpload,
  importProject,
  PROJECT_STORAGE_KEY,
  getPluginModels,
  getAllModels,
  getModelFiles,
  renameProject,
  isMatching,
  exists,
} from 'src/composables/Project';
import { FileInformation, FileInput } from 'leto-modelizer-plugin-core';
import Branch from 'src/models/git/Branch';
import git from 'isomorphic-git';
import FileStatus from 'src/models/git/FileStatus';

jest.mock('isomorphic-git', () => ({
  init: jest.fn(() => Promise.resolve('init')),
  clone: jest.fn(({ onAuth }) => {
    onAuth();

    return Promise.resolve('clone');
  }),
  branch: jest.fn(({ ref }) => {
    if (ref === 'error') {
      return Promise.reject({ message: 'ERROR' });
    }

    if (ref === 'enotdir') {
      return Promise.reject({ message: 'ENOTDIR: File is not a directory.' });
    }

    return Promise.resolve('branch');
  }),
  addRemote: jest.fn(() => Promise.resolve('addRemote')),
  fetch: jest.fn(),
  checkout: jest.fn(() => Promise.resolve('checkout')),
  listFiles: jest.fn(() => Promise.resolve(['/test/file.txt'])),
  listBranches: jest.fn(({ remote }) => {
    if (!remote) {
      return Promise.resolve(['HEAD', 'main', 'local']);
    }

    return Promise.resolve(['HEAD', 'main', 'remote']);
  }),
  resolveRef: jest.fn(() => Promise.resolve('resolveRef')),
  readBlob: jest.fn(() => Promise.resolve({ blob: 'test' })),
  currentBranch: jest.fn(() => Promise.resolve('main')),
  pull: jest.fn(({ onAuth }) => {
    onAuth();

    return Promise.resolve('pull');
  }),
  statusMatrix: jest.fn(() => Promise.resolve([['test', 0, 1, 2]])),
  push: jest.fn(({ onAuth }) => {
    onAuth();

    return Promise.resolve('pull');
  }),
  add: jest.fn(() => Promise.resolve('add')),
  commit: jest.fn(() => Promise.resolve('SHA-1')),
  log: jest.fn(() => Promise.resolve(['log'])),
}));

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
    mkdir: jest.fn((path, cb) => cb(path === 'projectId/error' ? 'error' : undefined)),
    writeFile: jest.fn((path, content, _, cb) => cb(path === 'projectId/error' ? 'error' : undefined)),
    appendFile: jest.fn((path, content, _, cb) => cb(path === 'projectId/error' ? 'error' : undefined)),
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

describe('Test composable: Project', () => {
  let gitAddMock;
  let gitAddRemoteMock;
  let gitFetchMock;

  beforeEach(() => {
    localStorage.clear();
    gitAddMock = jest.fn();
    gitAddRemoteMock = jest.fn();
    gitFetchMock = jest.fn(({ onAuth }) => {
      onAuth();

      return Promise.resolve('fetch');
    });

    git.add.mockImplementation(gitAddMock);
    git.fetch.mockImplementation(gitFetchMock);
    git.addRemote.mockImplementation(gitAddRemoteMock);
  });

  describe('Test function: getProjects', () => {
    it('should return empty set', () => {
      const projects = getProjects();

      expect(projects).toBeDefined();
      expect(projects).toStrictEqual({});
    });

    it('should return saved projects', () => {
      const projects = {
        foo: { id: 'foo' },
        bar: { id: 'bar' },
        qaz: { id: 'qaz' },
        quz: { id: 'quz' },
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
      const projects = { foo: { id: 'foo' } };

      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));

      const project = getProjectById('foo');

      expect(project).toStrictEqual({ id: 'foo' });
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
    it('should save projects', () => {
      saveProject({ id: 'foo' });
      saveProject({ id: 'bar' });

      const projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));

      expect(projects).toStrictEqual({
        foo: { id: 'foo' },
        bar: { id: 'bar' },
      });
    });

    it('should update project', () => {
      saveProject({ id: 'foo', text: 'qaz' });

      let projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));

      expect(projects.foo).toStrictEqual({ id: 'foo', text: 'qaz' });
      saveProject({ id: 'foo', text: 'quz' });
      projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));
      expect(projects.foo).toStrictEqual({ id: 'foo', text: 'quz' });
    });
  });

  describe('Test function: initProject', () => {
    it('should init and create commit with default file', async () => {
      await initProject({ id: 'foo' });
      expect(git.init).toBeCalled();
      expect(git.add).toBeCalled();
      expect(git.commit).toBeCalled();
    });
  });

  describe('Test function: importProject', () => {
    it('should call git clone', async () => {
      await importProject({
        id: 'foo',
        git: {
          repository: 'test',
          username: 'test',
          token: 'test',
        },
      });
      expect(git.clone).toBeCalled();
    });
  });

  describe('Test function: deleteProjectById', () => {
    it('should delete one project', async () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        foo: { id: 'foo' },
        bar: { id: 'bar' },
      }));
      await deleteProjectById('foo');
      const projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));

      expect(projects.bar).toStrictEqual({ id: 'bar' });
      expect(projects.foo).not.toBeDefined();
    });
  });

  describe('Test function: createProjectFolder', () => {
    it('should return undefined when dir is created', async () => {
      const result = await createProjectFolder('projectId', 'goodPath');

      expect(result).toBeUndefined();
    });

    it('should return undefined when dir is created', async () => {
      const result = await createProjectFolder('projectId', 'a/b/c');

      expect(result).toBeUndefined();
    });

    it('should return an error when dir is not created', async () => {
      const error = await createProjectFolder('projectId', 'error').catch((e) => e);

      expect(error).toBeDefined();
    });
  });

  describe('Test function: writeProjectFile', () => {
    it('should succeed and return undefined', async () => {
      const result = await writeProjectFile('projectId', { path: 'goodPath', content: 'content' });

      expect(result).toBeUndefined();
    });

    it('should fail and return error', async () => {
      const error = await writeProjectFile('projectId', { path: 'error', content: 'content' }).catch((e) => e);

      expect(error).toBeDefined();
    });
  });

  describe('Test function: appendProjectFile', () => {
    it('should succeed and return undefined', async () => {
      const result = await appendProjectFile('projectId', { path: 'goodPath', content: 'content' });

      expect(result).toBeUndefined();
    });

    it('should fail and return error', async () => {
      const error = await appendProjectFile('projectId', { path: 'error', content: 'content' }).catch((e) => e);

      expect(error).toBeDefined();
    });

    it('should succeed with multiple folder and return undefined', async () => {
      const result = await appendProjectFile('projectId', { path: 'test/goodPath', content: 'content' }).catch((e) => e);

      expect(result).toBeUndefined();
    });
  });

  describe('Test function: gitAddRemote', () => {
    it('should call all needed git method', async () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        test: {
          id: 'test',
          git: {
            repository: 'test',
            username: 'test',
            token: 'test',
          },
        },
      }));
      await gitAddRemote({
        id: 'test',
        git: {
          repository: 'test',
          username: 'test',
          token: 'test',
        },
      });

      expect(gitAddRemoteMock).toBeCalled();
    });
  });

  describe('Test function: gitFetch', () => {
    it('should not call git.fetch', async () => {
      const result = await gitFetch({});

      expect(gitFetchMock).not.toBeCalled();
      expect(result).toBeUndefined();
    });

    it('should call git.fetch', async () => {
      const result = await gitFetch({ git: { repository: 'test' } });

      expect(gitFetchMock).toBeCalled();
      expect(result).toEqual('fetch');
    });
  });

  describe('Test function: gitCheckout', () => {
    it('should emit checkout event', async () => {
      const result = await gitCheckout('projectId', 'test').then(() => 'success');

      expect(result).toEqual('success');
    });
  });

  describe('Test function: getProjectFiles', () => {
    it('should return file information array', async () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        test: { id: 'test', git: {} },
      }));

      const result = await getProjectFiles('test');

      expect(result).toEqual([
        new FileInformation({ path: 'file.txt' }),
        new FileInformation({ path: 'emptyParent/__empty__' }),
        new FileInformation({ path: 'parent/file.txt' }),
      ]);
    });
  });

  describe('Test function: readProjectFile', () => {
    it('should return file input', async () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        test: { id: 'test', git: {} },
      }));

      const result = await readProjectFile('test', new FileInformation({ path: '/test/file.txt' }));

      expect(result).toEqual(new FileInput({ path: '/test/file.txt', content: 'test' }));
    });
  });

  describe('Test function: getCurrentBranch', () => {
    it('should return current branch name', async () => {
      const result = await getCurrentBranch('test');

      expect(result).toEqual('main');
    });
  });

  describe('Test function: getBranches', () => {
    it('should return valid branches', async () => {
      const branches = await getBranches('test');

      expect(branches).toEqual([
        new Branch({
          name: 'main',
          onLocal: true,
          onRemote: true,
          remote: 'origin',
        }),
        new Branch({
          name: 'local',
          onLocal: true,
          onRemote: false,
          remote: 'origin',
        }),
        new Branch({
          name: 'remote',
          onLocal: false,
          onRemote: true,
          remote: 'origin',
        }),
      ]);
    });
  });

  describe('Test function: createBranchFrom', () => {
    it('should succeed when there is no issue', async () => {
      const result = await createBranchFrom('test', 'branch', 'main').then(() => 'success');

      expect(result).toEqual('success');
    });

    it('should fail in case of ENOTDIR', async () => {
      const error = await createBranchFrom('test', 'enotdir', 'main').catch(({ message }) => message);

      expect(error).toEqual('ENOTDIR: File is not a directory.');
    });

    it('should fail in case of ERROR', async () => {
      const error = await createBranchFrom('test', 'error', 'main').catch(({ message }) => message);

      expect(error).toEqual('ERROR');
    });
  });

  describe('Test function: gitUpdate', () => {
    it('should call git pull', async () => {
      await gitUpdate(
        {
          id: 'test',
          git: {
            username: 'username',
            token: 'token',
          },
        },
        'branch',
        true,
      );

      expect(git.pull).toBeCalled();
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
    });
  });

  describe('Test function: getStatus', () => {
    it('should be a success and return an array with one valid FileStatus', async () => {
      expect(await getStatus()).toEqual([new FileStatus({
        path: 'test',
        headStatus: 0,
        workdirStatus: 1,
        stageStatus: 2,
      })]);
    });
  });

  describe('Test function: gitPush', () => {
    it('should call git push and emit event', async () => {
      await gitPush(
        {
          id: 'test',
          git: {
            username: 'username',
            token: 'token',
          },
        },
        'branch',
        true,
      );

      expect(git.push).toBeCalled();
    });
  });

  describe('Test function: gitAdd', () => {
    it('should call git add', async () => {
      await gitAdd('projectId', 'filepath');

      expect(gitAddMock).toBeCalled();
    });
  });

  describe('Test function: gitCommit', () => {
    it('should call git commit and return SHA-1', async () => {
      const result = await gitCommit('test', 'wip');

      expect(result).toEqual('SHA-1');
    });
  });

  describe('Test function: gitGlobalUpload', () => {
    it('should succeed', async () => {
      const result = await gitGlobalUpload({
        git: {
          username: 'username',
          token: 'token',
        },
      }).then(() => 'success');

      expect(result).toEqual('success');
    });
  });

  describe('Test function: gitLog', () => {
    it('should return valid log', async () => {
      const result = await gitLog('test', 'main');

      expect(result).toEqual(['log']);
    });

    it('should call git log with default depth', async () => {
      await gitLog('test', 'main');
      expect(git.log).toBeCalledWith(expect.objectContaining({ depth: 25 }));
    });

    it('should call git log with specified depth', async () => {
      await gitLog('test', 'main', 1);
      expect(git.log).toBeCalledWith(expect.objectContaining({ depth: 1 }));
    });
  });

  describe('Test function: getPluginModels', () => {
    it('should return an empty array', async () => {
      expect(await getPluginModels('empty', 'pluginName')).toEqual([]);
    });

    it('should return an array with one entry', async () => {
      expect(await getPluginModels('test', 'container')).toEqual([{
        name: 'parent',
        plugin: 'container',
      }, {
        name: 'emptyParent',
        plugin: 'container',
      }]);
    });
  });

  describe('Test function: getAllModels', () => {
    it('should return an empty array', async () => {
      expect(await getAllModels('test')).toEqual([]);
    });
  });

  describe('Test function: getModelFiles', () => {
    it('should an array', async () => {
      const array = await getModelFiles();

      expect(Array.isArray(array)).toBeTruthy();
    });
  });

  describe('Test function: renameProject', () => {
    it('should rename a project', async () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        foo: { id: 'foo' },
      }));
      await renameProject('foo', 'bar');

      const projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));

      expect(projects.foo).not.toBeDefined();
      expect(projects.bar).toStrictEqual({ id: 'bar' });
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
});
