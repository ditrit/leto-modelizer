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

  describe('Test event: SelectNodeEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.SelectNodeEvent).toBeDefined();
      expect(FileEvent.SelectNodeEvent).toEqual(new Subject());
    });
  });

  describe('Test event: CreateFileEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.CreateFileEvent).toBeDefined();
      expect(FileEvent.CreateFileEvent).toEqual(new Subject());
    });
  });

  describe('Test event: DeleteFileEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.DeleteFileEvent).toBeDefined();
      expect(FileEvent.DeleteFileEvent).toEqual(new Subject());
    });
  });

  describe('Test event: ExpandFolderEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.ExpandFolderEvent).toBeDefined();
      expect(FileEvent.ExpandFolderEvent).toEqual(new Subject());
    });
  });

  describe('Test event: UpdateFileEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.UpdateFileEvent).toBeDefined();
      expect(FileEvent.UpdateFileEvent).toEqual(new Subject());
    });
  });

  describe('Test event: GlobalSaveFilesEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.GlobalSaveFilesEvent).toBeDefined();
      expect(FileEvent.GlobalSaveFilesEvent).toEqual(new Subject());
    });
  });
});
