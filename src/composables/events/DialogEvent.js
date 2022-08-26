import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to close or open a dialog.
 * The event should be an Object that contains the `type` of action to do on
 * the dialog ('close' or 'open') and the `key` of the dialog.
 * Example: { type: 'open', key: 'dialogKey' }
 * @typedef {Subject} DialogEvent
 */
const DialogEvent = new Subject();

export default DialogEvent;
