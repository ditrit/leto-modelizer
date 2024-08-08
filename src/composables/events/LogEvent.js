import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive log of current editing file.
 * @typedef {Subject} FileLogEvent
 */
const FileLogEvent = new Subject();

export default {
  FileLogEvent,
};
