import DrawerEvent from 'src/composables/events/DrawerEvent';
import { Subject } from 'rxjs';

describe('Test composable: DrawerEvent', () => {
  it('should export a Subject', () => {
    expect(DrawerEvent).toBeDefined();
    expect(DrawerEvent).toEqual(new Subject());
  });
});
