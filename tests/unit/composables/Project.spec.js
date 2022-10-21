import {
  createProjectTemplate,
  getProjects,
  getProjectById,
  getProjectName,
  saveProject,
  deleteProjectById,
  initProject,
  getProjectFiles,
  readProjectFile,
  updateGitProject,
  getCurrentBranch,
  fetchGit,
  getBranches,
  checkout,
  createBranchFrom,
  gitUpdate,
  gitPrune,
  PROJECT_STORAGE_KEY,
} from 'src/composables/Project';
import { FileInformation, FileInput } from 'leto-modelizer-plugin-core';
import Branch from 'src/models/git/Branch';
import git from 'isomorphic-git';
import GitEvent from 'src/composables/events/GitEvent';

jest.mock('isomorphic-git', () => ({
  init: jest.fn(() => Promise.resolve('init')),
  branch: jest.fn(() => Promise.resolve('branch')),
  addRemote: jest.fn(() => Promise.resolve('addRemote')),
  fetch: jest.fn(({ onAuth }) => {
    onAuth();
    return Promise.resolve('fetch');
  }),
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
}));

jest.mock('src/composables/events/GitEvent', () => ({
  FetchEvent: {
    next: jest.fn(() => Promise.resolve('FetchEventNext')),
  },
  CheckoutEvent: {
    next: jest.fn(() => Promise.resolve('CheckoutEventNext')),
  },
  NewBranchEvent: {
    next: jest.fn(() => Promise.resolve('NewBranchEventNext')),
  },
}));

jest.mock('browserfs', () => ({
  install: jest.fn(),
  configure: jest.fn(),
  BFSRequire: jest.fn(() => ({
    Buffer: {
      from: jest.fn(() => 'test'),
    },
    stat: jest.fn((path, cb) => {
      if (path === 'test' || path === 'test/parent') {
        return cb(null, { isDirectory: () => true });
      }
      return cb(null, { isDirectory: () => false });
    }),
    readdir: jest.fn((path, cb) => {
      const files = ['file.txt'];
      if (path === 'test') {
        files.push('parent');
      } else if (path === 'test/parent') {
        files.push('file.txt');
      }
      return cb(null, files);
    }),
    readFile: jest.fn((path, format, cb) => cb(null, 'test')),
  })),
}));

describe('Test composable: Project', () => {
  window.crypto = {
    getRandomValues: () => 0x16,
  };

  beforeEach(() => localStorage.clear());

  describe('Test function: createProjectTemplate', () => {
    it('should return project with generated ID', () => {
      const project = createProjectTemplate();
      expect(project).toBeDefined();
      expect(project.id).toEqual('project-00000000');
    });
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
    it('should call git init', async () => {
      const result = await initProject({ id: 'foo' });
      expect(result).toEqual('init');
    });
  });

  describe('Test function: deleteProject', () => {
    it('should delete one project', () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        foo: { id: 'foo' },
        bar: { id: 'bar' },
      }));
      deleteProjectById('foo');
      const projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));
      expect(projects.bar).toStrictEqual({ id: 'bar' });
      expect(projects.foo).not.toBeDefined();
    });
  });

  describe('Test function: updateGitProject', () => {
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
      const result = await updateGitProject({
        id: 'test',
        git: {
          repository: 'test',
          username: 'test',
          token: 'test',
        },
      });

      expect(result).toEqual('FetchEventNext');
    });
  });

  describe('Test function: fetchGit', () => {
    it('should emit fetch event', async () => {
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
      const result = await fetchGit('test');
      expect(result).toEqual('FetchEventNext');
    });
  });

  describe('Test function: checkout', () => {
    it('should emit checkout event', async () => {
      const result = await checkout('projectId', 'test');
      expect(result).toEqual('CheckoutEventNext');
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
        new FileInformation({ path: 'parent/file.txt' }),
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
    it('should not call checkout function when haveToCheckout is false', async () => {
      git.checkout = jest.fn();
      await createBranchFrom('test', 'branch', 'main', false);
      expect(git.checkout).not.toBeCalled();
      expect(GitEvent.NewBranchEvent.next).toBeCalled();
    });

    it('should call checkout function when haveToCheckout is true', async () => {
      git.checkout = jest.fn();
      await createBranchFrom('test', 'branch', 'main', true);
      expect(git.checkout).toBeCalled();
      expect(GitEvent.NewBranchEvent.next).toBeCalled();
    });
  });

  describe('Test function: gitUpdate', () => {
    it('should call git pull', async () => {
      const result = await gitUpdate(
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
      expect(result).toEqual('pull');
    });
  });

  describe('Test function: gitPrune', () => {
    it('should call git fetch with repository', async () => {
      git.fetch = jest.fn();
      await gitPrune(
        {
          id: 'test',
          git: {
            repository: 'test',
            username: 'username',
            token: 'token',
          },
        },
      );
      expect(git.fetch).toBeCalled();
      expect(GitEvent.FetchEvent.next).toBeCalled();
    });
    it('should not call git fetch without repository', async () => {
      git.fetch = jest.fn();
      await gitPrune(
        {
          id: 'test',
        },
      );
      expect(git.fetch).not.toBeCalled();
      expect(GitEvent.FetchEvent.next).toBeCalled();
    });
  });
});
