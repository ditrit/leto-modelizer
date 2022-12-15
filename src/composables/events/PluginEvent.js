import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about plugins initialization.
 * @typedef {Subject} InitEvent
 */
const InitEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugin component selection.
 * @typedef {Subject} SelectEvent
 */
const SelectEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugin component edition.
 * @typedef {Subject} EditEvent
 */
const EditEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugins component deletion.
 * @typedef {Subject} DeleteEvent
 */
const DeleteEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugins component parsing.
 * @typedef {Subject} ParseEvent
 */
const ParseEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugins component drawing.
 * @typedef {Subject} DrawEvent
 */
const DrawEvent = new Subject();

export default {
  InitEvent,
  SelectEvent,
  EditEvent,
  DeleteEvent,
  ParseEvent,
  DrawEvent,
};
