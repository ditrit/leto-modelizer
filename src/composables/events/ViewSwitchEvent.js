import { Subject } from 'rxjs';

/**
 * Represent a Event object to emit and to receive
 * the switching of the view type ('model or 'text').
 *
 * @typedef {Subject} ViewSwitchEvent
 */
const ViewSwitchEvent = new Subject();

export default ViewSwitchEvent;
