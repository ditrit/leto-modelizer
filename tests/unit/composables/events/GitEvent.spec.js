import GitEvent from 'src/composables/events/GitEvent';
import { Subject } from 'rxjs';

describe('Test composable: GitEvent', () => {
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

  describe('Test event: PullEvent', () => {
    it('should export a Subject', () => {
      expect(GitEvent.PullEvent).toBeDefined();
      expect(GitEvent.PullEvent).toEqual(new Subject());
    });
  });

  describe('Test event: PushEvent', () => {
    it('should export a Subject', () => {
      expect(GitEvent.PushEvent).toBeDefined();
      expect(GitEvent.PushEvent).toEqual(new Subject());
    });
  });
});
