import { Subject } from 'rxjs';

/**
  * Represent a rxjs Event object to emit and to receive events about git authentication.
  * @typedef {Subject} AuthenticationEvent
  */
const AuthenticationEvent = new Subject();

export default {
  AuthenticationEvent,
};
