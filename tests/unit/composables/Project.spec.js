import { createProject } from 'src/composables/Project';

describe('Test composable: Project', () => {
  window.crypto = {
    getRandomValues: () => 0x16,
  };

  describe('Test function: createProject', () => {
    it('Should return project with generated ID', () => {
      const project = createProject();
      expect(project).toBeDefined();
      expect(project.id).toEqual('project-00000000');
    });
  });
});
