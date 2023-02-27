import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive project update.
 * @typedef {Subject} UpdateProjectEvent
 */
const UpdateProjectEvent = new Subject();

export default {
  UpdateProjectEvent,
};
