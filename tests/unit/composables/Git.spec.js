import {
  gitInit,
  gitAddRemote,
  getCurrentBranch,
  gitFetch,
  getBranches,
  gitCheckout,
  createBranchFrom,
  gitUpdate,
  getStatus,
  gitListFiles,
  gitPush,
  gitAdd,
  gitRemove,
  gitCommit,
  gitLog,
  gitGlobalUpload,
  importProject,
} from 'src/composables/Git';
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
  remove: jest.fn(() => Promise.resolve('remove')),
  commit: jest.fn(() => Promise.resolve('SHA-1')),
  log: jest.fn(() => Promise.resolve(['log'])),
}));

jest.mock('src/composables/Project', () => ({
  saveProject: () => Promise.resolve(),
}));

describe('Test composable: Git', () => {
  let gitFetchMock;

  beforeEach(() => {
    localStorage.clear();
    gitFetchMock = jest.fn(({ onAuth }) => {
      onAuth();

      return Promise.resolve('fetch');
    });

    git.fetch.mockImplementation(gitFetchMock);
  });

  describe('Test function: gitInit', () => {
    it('should call git init', async () => {
      await gitInit('foo');
      expect(git.init).toBeCalled();
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

  describe('Test function: gitAddRemote', () => {
    it('should call all needed git method', async () => {
      await gitAddRemote({
        id: 'test',
        git: {
          repository: 'test',
          username: 'test',
          token: 'test',
        },
      });

      expect(git.addRemote).toBeCalled();
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

  describe('Test function: getStatus', () => {
    it('should be a success and return an array with one valid FileStatus', async () => {
      expect(await getStatus('projectName')).toEqual([new FileStatus({
        path: 'projectName/test',
        headStatus: 0,
        workdirStatus: 1,
        stageStatus: 2,
      })]);
    });
  });

  describe('Test function: gitListFiles', () => {
    it('should be a success and return an array with list of filePaths', async () => {
      expect(await gitListFiles()).toEqual(['/test/file.txt']);
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

      expect(git.add).toBeCalled();
    });
  });

  describe('Test function: gitRemove', () => {
    it('should call git remove', async () => {
      await gitRemove('projectId', 'filepath');

      expect(git.remove).toBeCalled();
    });
  });

  describe('Test function: gitCommit', () => {
    it('should call git commit and return SHA-1', async () => {
      let result = await gitCommit('test', 'wip');
      expect(result).toEqual('SHA-1');

      result = await gitCommit('test', 'wip', true);
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
});
