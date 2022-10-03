import UpdateRemoteEvent from 'src/composables/events/GitEvent';
import { Subject } from 'rxjs';

describe('Test composable: GitEvent', () => {
  describe('Test event: UpdateRemoteEvent', () => {
    it('Should export a Subject', () => {
      expect(UpdateRemoteEvent).toBeDefined();
      expect(UpdateRemoteEvent).toEqual(new Subject());
    });
  });
});
