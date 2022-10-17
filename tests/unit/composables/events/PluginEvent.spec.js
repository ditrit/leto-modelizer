import PluginEvent from 'src/composables/events/PluginEvent';
import { Subject } from 'rxjs';

describe('Test composable: PluginEvent', () => {
  describe('Test event: InitEvent', () => {
    it('Should export a Subject', () => {
      expect(PluginEvent.InitEvent).toBeDefined();
      expect(PluginEvent.InitEvent).toEqual(new Subject());
    });
  });

  describe('Test event: SelectEvent', () => {
    it('Should export a Subject', () => {
      expect(PluginEvent.SelectEvent).toBeDefined();
      expect(PluginEvent.SelectEvent).toEqual(new Subject());
    });
  });

  describe('Test event: EditEvent', () => {
    it('Should export a Subject', () => {
      expect(PluginEvent.EditEvent).toBeDefined();
      expect(PluginEvent.EditEvent).toEqual(new Subject());
    });
  });

  describe('Test event: DeleteEvent', () => {
    it('Should export a Subject', () => {
      expect(PluginEvent.DeleteEvent).toBeDefined();
      expect(PluginEvent.DeleteEvent).toEqual(new Subject());
    });
  });
});
