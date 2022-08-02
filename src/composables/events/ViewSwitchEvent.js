import { Subject } from 'rxjs';

/**
 * Represent a Event object to emit and to receive
 * the switching of the view type ('model or 'text').
 *
 * @typedef {Subject} ViewSwitchEvent
 */
const ViewSwitchEvent = new Subject();

/**
 * Emit a new event to all the subscribers.
 * The event should be a string equal to 'model' or 'text'.
 *
 * @param {string} event
 */
ViewSwitchEvent.emit = (event) => ViewSwitchEvent.next(event);

/**
 * Unsubscribe to this event.
 *
 * @param {object} subscription
 */
ViewSwitchEvent.off = (subscription) => subscription.unsubscribe();

/**
 * Subscribe to this event.
 * It gets a callback function which will be call everytime a new event is emitted.
 * It returns a subscription object which will be used to unsubscribe.
 *
 * @param {function} callback
 * @returns {object} subscription
 */
ViewSwitchEvent.on = (callback) => ViewSwitchEvent.subscribe(callback);

export default ViewSwitchEvent;
