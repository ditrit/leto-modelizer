import PluginEvent from 'src/composables/events/PluginEvent';
import { Subject } from 'rxjs';

describe('Test composable: PluginEvent', () => {
  describe('Test event: InitEvent', () => {
    it('should export a Subject', () => {
      expect(PluginEvent.InitEvent).toBeDefined();
      expect(PluginEvent.InitEvent).toEqual(new Subject());
    });
  });

  describe('Test event: DefaultEvent', () => {
    it('should export a Subject', () => {
      expect(PluginEvent.DefaultEvent).toBeDefined();
      expect(PluginEvent.DefaultEvent).toEqual(new Subject());
    });
  });
});
