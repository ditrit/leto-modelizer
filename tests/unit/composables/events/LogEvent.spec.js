import { Subject } from 'rxjs';
import LogEvent from 'src/composables/events/LogEvent';

describe('Test composable: LogEvent', () => {
  it('should export a Subject', () => {
    expect(LogEvent.FileLogEvent).toBeDefined();
    expect(LogEvent.FileLogEvent).toEqual(new Subject());
  });
});
