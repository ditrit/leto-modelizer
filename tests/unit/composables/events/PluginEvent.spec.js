import PluginEvent from 'src/composables/events/PluginEvent';
import { Subject } from 'rxjs';

describe('Test composable: PluginEvent', () => {
  describe('Test event: InitEvent', () => {
    it('Should export a Subject', () => {
      expect(PluginEvent.InitEvent).toBeDefined();
      expect(PluginEvent.InitEvent).toEqual(new Subject());
    });
  });
});
