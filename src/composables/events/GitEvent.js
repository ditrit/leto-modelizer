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
 * The event should contain the name of the branch to checkout.
 * @typedef {Subject} CheckoutEvent
 */
const CheckoutEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events when a new branch is created.
 * @typedef {Subject} NewBranchEvent
 */
const NewBranchEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events when an add is done on git.
 * The event should contain the path (id) of the file to add.
 * @typedef {Subject} AddEvent
 */
const AddEvent = new Subject();

/**
  * Represent a rxjs Event object to emit and to receive events when a commit is done on git.
  * The event should contain an Array of the staged file(s) path.
  * @typedef {Subject} CommitEvent
  */
const CommitEvent = new Subject();

/**
  * Represent a rxjs Event object to emit and to receive events about git authentication.
  * @typedef {Subject} AuthenticationEvent
  */
const AuthenticationEvent = new Subject();

export default {
  CheckoutEvent,
  AddRemoteEvent,
  NewBranchEvent,
  PullEvent,
  PushEvent,
  AddEvent,
  CommitEvent,
  AuthenticationEvent,
};
