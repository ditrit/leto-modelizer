import PluginEvent from 'src/composables/events/PluginEvent';
import { Subject } from 'rxjs';

describe('Test composable: PluginEvent', () => {
  describe('Test event: InitEvent', () => {
    it('should export a Subject', () => {
      expect(PluginEvent.InitEvent).toBeDefined();
      expect(PluginEvent.InitEvent).toEqual(new Subject());
    });
  });

  describe('Test event: SelectEvent', () => {
    it('should export a Subject', () => {
      expect(PluginEvent.SelectEvent).toBeDefined();
      expect(PluginEvent.SelectEvent).toEqual(new Subject());
    });
  });

  describe('Test event: EditEvent', () => {
    it('should export a Subject', () => {
      expect(PluginEvent.EditEvent).toBeDefined();
      expect(PluginEvent.EditEvent).toEqual(new Subject());
    });
  });

  describe('Test event: UpdateEvent', () => {
    it('should export a Subject', () => {
      expect(PluginEvent.UpdateEvent).toBeDefined();
      expect(PluginEvent.UpdateEvent).toEqual(new Subject());
    });
  });

  describe('Test event: ParseEvent', () => {
    it('should export a Subject', () => {
      expect(PluginEvent.ParseEvent).toBeDefined();
      expect(PluginEvent.ParseEvent).toEqual(new Subject());
    });
  });

  describe('Test event: DrawEvent', () => {
    it('should export a Subject', () => {
      expect(PluginEvent.DrawEvent).toBeDefined();
      expect(PluginEvent.DrawEvent).toEqual(new Subject());
    });
  });
});
