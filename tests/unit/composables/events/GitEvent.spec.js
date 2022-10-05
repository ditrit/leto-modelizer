import GitEvent from 'src/composables/events/GitEvent';
import { Subject } from 'rxjs';

describe('Test composable: GitEvent', () => {
  describe('Test event: UpdateRemoteEvent', () => {
    it('Should export a Subject', () => {
      expect(GitEvent.UpdateRemoteEvent).toBeDefined();
      expect(GitEvent.UpdateRemoteEvent).toEqual(new Subject());
    });
  });

  describe('Test event: FetchEvent', () => {
    it('Should export a Subject', () => {
      expect(GitEvent.FetchEvent).toBeDefined();
      expect(GitEvent.FetchEvent).toEqual(new Subject());
    });
  });
});
