import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to close or open a drawer.
 * The event should be an Object that contains the `type` of action to do on
 * the drawer ('close' or 'open') and the `key` of the drawer.
 * Example: { type: 'open', key: 'drawerKey' }
 * @typedef {Subject} DrawerEvent
 */
const DrawerEvent = new Subject();

export default DrawerEvent;
