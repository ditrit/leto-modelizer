import {
  createProjectTemplate,
  getProjects,
  getProjectById,
  saveProject,
  deleteProjectById,
  deleteAllProjects,
  PROJECT_STORAGE_KEY,
} from 'src/composables/Project';

describe('Test composable: Project', () => {
  window.crypto = {
    getRandomValues: () => 0x16,
  };

  beforeEach(() => localStorage.clear());

  describe('Test function: createProjectTemplate', () => {
    it('Should return project with generated ID', () => {
      const project = createProjectTemplate();
      expect(project).toBeDefined();
      expect(project.id).toEqual('project-00000000');
    });
  });

  describe('Test function: getProjects', () => {
    it('Should return empty set', () => {
      const projects = getProjects();
      expect(projects).toBeDefined();
      expect(projects).toStrictEqual({});
    });

    it('Should return saved projects', () => {
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
    it('Should not find a project', () => {
      const project = getProjectById('foo');
      expect(project).not.toBeDefined();
    });

    it('Should return saved project', () => {
      const projects = { foo: { id: 'foo' } };
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
      const project = getProjectById('foo');
      expect(project).toStrictEqual({ id: 'foo' });
    });
  });

  describe('Test function: saveProject', () => {
    it('Should save projects', () => {
      saveProject({ id: 'foo' });
      saveProject({ id: 'bar' });
      const projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));
      expect(projects).toStrictEqual({
        foo: { id: 'foo' },
        bar: { id: 'bar' },
      });
    });

    it('Should update project', () => {
      saveProject({ id: 'foo', text: 'qaz' });
      let projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));
      expect(projects.foo).toStrictEqual({ id: 'foo', text: 'qaz' });
      saveProject({ id: 'foo', text: 'quz' });
      projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));
      expect(projects.foo).toStrictEqual({ id: 'foo', text: 'quz' });
    });
  });

  describe('Test function: deleteProject', () => {
    it('Should delete one project', () => {
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

  describe('Test function: deleteAllProjects', () => {
    it('Should delete all projects', () => {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({
        foo: { id: 'foo' },
        bar: { id: 'bar' },
        qaz: { id: 'qaz' },
        quz: { id: 'quz' },
      }));
      deleteAllProjects();
      const projects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY));
      expect(projects).toStrictEqual({});
    });
  });
});
