import ModelEvent from 'src/composables/events/ModelEvent';
import { Subject } from 'rxjs';

describe('Test composable: ModelEvent', () => {
  it('should export a Subject', () => {
    expect(ModelEvent).toBeDefined();
    expect(ModelEvent).toEqual(new Subject());
  });
});
