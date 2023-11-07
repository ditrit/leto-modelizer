import FileEvent from 'src/composables/events/FileEvent';
import { Subject } from 'rxjs';

describe('Test composable: FileEvent', () => {
  describe('Test event: SelectFileTabEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.SelectFileTabEvent).toBeDefined();
      expect(FileEvent.SelectFileTabEvent).toEqual(new Subject());
    });
  });

  describe('Test event: SelectFileNodeEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.SelectFileNodeEvent).toBeDefined();
      expect(FileEvent.SelectFileNodeEvent).toEqual(new Subject());
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

  describe('Test event: CreateFileNodeEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.CreateFileNodeEvent).toBeDefined();
      expect(FileEvent.CreateFileNodeEvent).toEqual(new Subject());
    });
  });

  describe('Test event: UpdateEditorContentEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.UpdateEditorContentEvent).toBeDefined();
      expect(FileEvent.UpdateEditorContentEvent).toEqual(new Subject());
    });
  });

  describe('Test event: GlobalUploadFilesEvent', () => {
    it('should export a Subject', () => {
      expect(FileEvent.GlobalUploadFilesEvent).toBeDefined();
      expect(FileEvent.GlobalUploadFilesEvent).toEqual(new Subject());
    });
  });
});
