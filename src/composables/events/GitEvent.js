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

/**
 * Represent a rxjs Event object to emit and to receive events when a checkout is done on git.
 * @typedef {Subject} CheckoutEvent
 */
const CheckoutEvent = new Subject();

export default {
  CheckoutEvent,
  FetchEvent,
  UpdateRemoteEvent,
};
