import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about plugins initialization.
 * @typedef {Subject} InitEvent
 */
const InitEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugin component edition.
 * @typedef {Subject} EditEvent
 */
const EditEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about components update by
 * the plugin.
 * @typedef {Subject} UpdateEvent
 */
const UpdateEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugins.
 * @typedef {Subject} DefaultEvent
 */
const DefaultEvent = new Subject();

export default {
  InitEvent,
  EditEvent,
  UpdateEvent,
  DefaultEvent,
};
