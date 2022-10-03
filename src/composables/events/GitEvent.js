import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about updated remote on git.
 * @typedef {Subject} UpdateRemoteEvent
 */
const UpdateRemoteEvent = new Subject();

export default UpdateRemoteEvent;
