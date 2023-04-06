import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about plugins initialization.
 * @typedef {Subject} InitEvent
 */
const InitEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugins.
 * @typedef {Subject} DefaultEvent
 */
const DefaultEvent = new Subject();

export default {
  InitEvent,
  DefaultEvent,
};
