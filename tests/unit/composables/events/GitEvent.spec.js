import GitEvent from 'src/composables/events/GitEvent';
import { Subject } from 'rxjs';

describe('Test composable: GitEvent', () => {
  describe('Test event: UpdateRemoteEvent', () => {
    it('should export a Subject', () => {
      expect(GitEvent.UpdateRemoteEvent).toBeDefined();
      expect(GitEvent.UpdateRemoteEvent).toEqual(new Subject());
    });
  });

  describe('Test event: FetchEvent', () => {
    it('should export a Subject', () => {
      expect(GitEvent.FetchEvent).toBeDefined();
      expect(GitEvent.FetchEvent).toEqual(new Subject());
    });
  });

  describe('Test event: CheckoutEvent', () => {
    it('should export a Subject', () => {
      expect(GitEvent.CheckoutEvent).toBeDefined();
      expect(GitEvent.CheckoutEvent).toEqual(new Subject());
    });
  });

  describe('Test event: NewBranchEvent', () => {
    it('should export a Subject', () => {
      expect(GitEvent.NewBranchEvent).toBeDefined();
      expect(GitEvent.NewBranchEvent).toEqual(new Subject());
    });
  });
});
