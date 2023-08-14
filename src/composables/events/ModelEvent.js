import { Subject } from 'rxjs';

/**
 * Represent a Event object to emit and to receive model update.
 * @typedef {Subject} UpdateModelEvent
 */
const UpdateModelEvent = new Subject();

export default UpdateModelEvent;
