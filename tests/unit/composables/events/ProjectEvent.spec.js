import ProjectEvent from 'src/composables/events/ProjectEvent';
import { Subject } from 'rxjs';

describe('Test composable: ProjectEvent', () => {
  describe('Test event: UpdateProjectEvent', () => {
    it('should export a Subject', () => {
      expect(ProjectEvent.UpdateProjectEvent).toBeDefined();
      expect(ProjectEvent.UpdateProjectEvent).toEqual(new Subject());
    });
  });
});
