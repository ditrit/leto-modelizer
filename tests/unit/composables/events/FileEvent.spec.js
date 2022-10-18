import FileEvent from 'src/composables/events/FileEvent';
import { Subject } from 'rxjs';

describe('Test composable: FileEvent', () => {
  describe('Test event: OpenFileEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.OpenFileEvent).toBeDefined();
      expect(FileEvent.OpenFileEvent).toEqual(new Subject());
    });
  });

  describe('Test event: SelectFileEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.SelectFileEvent).toBeDefined();
      expect(FileEvent.SelectFileEvent).toEqual(new Subject());
    });
  });
});
