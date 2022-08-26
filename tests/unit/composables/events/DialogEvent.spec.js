import DialogEvent from 'src/composables/events/DialogEvent';
import { Subject } from 'rxjs';

describe('Test composable: DialogEvent', () => {
  it('Should export a Subject', () => {
    expect(DialogEvent).toBeDefined();
    expect(DialogEvent).toEqual(new Subject());
  });
});
