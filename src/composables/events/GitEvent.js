import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about updated remote on git.
 * @typedef {Subject} UpdateRemoteEvent
 */
const UpdateRemoteEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events when a fetch is done on git.
 * @typedef {Subject} FetchEvent
 */
const FetchEvent = new Subject();

export default {
  FetchEvent,
  UpdateRemoteEvent,
};
