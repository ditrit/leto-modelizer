import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about updated remote on git.
 * @typedef {Subject} AddRemoteEvent
 */
const AddRemoteEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events when a pull is done on git.
 * @typedef {Subject} PullEvent
 */
const PullEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events when a push is done on git.
 * @typedef {Subject} PushEvent
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

/**
 * Represent a rxjs Event object to emit and to receive events about file node creation. // TODO
 * The event should contain the id of the created file node.
 * @typedef {Subject} AddEvent
 */
const AddEvent = new Subject();

/**
  * Represent a rxjs Event object to emit and to receive events about file node creation. // TODO
  * The event should contain the id of the created file node.
  * @typedef {Subject} CommitEvent
  */
const CommitEvent = new Subject();

export default {
  CheckoutEvent,
  AddRemoteEvent,
  NewBranchEvent,
  PullEvent,
  PushEvent,
  AddEvent,
  CommitEvent,
};
