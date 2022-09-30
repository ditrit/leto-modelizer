import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about plugin.
 * @typedef {Subject} PluginEvent
 */
const PluginEvent = new Subject();

export default PluginEvent;
