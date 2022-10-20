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
 * Represent a rxjs Event object to emit and to receive events when a pull is done on git.
 * @typedef {Subject} FetchEvent
 */
const PullEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events when a push is done on git.
 * @typedef {Subject} FetchEvent
 */
const PushEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events when a checkout is done on git.
 * @typedef {Subject} CheckoutEvent
 */
const CheckoutEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events when a new branch is created.
 * @typedef {Subject} NewBranchEvent
 */
const NewBranchEvent = new Subject();

export default {
  CheckoutEvent,
  FetchEvent,
  UpdateRemoteEvent,
  NewBranchEvent,
  PullEvent,
  PushEvent,
};
