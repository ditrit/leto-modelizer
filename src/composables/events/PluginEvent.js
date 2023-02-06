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
 * Represent a rxjs Event object to emit and to receive events about components update by
 * the plugin.
 * @typedef {Subject} UpdateEvent
 */
const UpdateEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugin parsing.
 * @typedef {Subject} ParseEvent
 */
const ParseEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugin components rendering.
 * Subject contains a FileInput[] of all rendered files.
 * @typedef {Subject} ParseEvent
 */
const RenderEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about plugin components drawing.
 * @typedef {Subject} DrawEvent
 */
const DrawEvent = new Subject();

export default {
  InitEvent,
  SelectEvent,
  EditEvent,
  UpdateEvent,
  ParseEvent,
  RenderEvent,
  DrawEvent,
};
