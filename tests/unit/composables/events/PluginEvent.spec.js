import PluginEvent from 'src/composables/events/PluginEvent';
import { Subject } from 'rxjs';

describe('Test composable: PluginEvent', () => {
  it('Should export a Subject', () => {
    expect(PluginEvent).toBeDefined();
    expect(PluginEvent).toEqual(new Subject());
  });
});
