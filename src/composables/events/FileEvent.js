import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about file creation.
 * The event should be an Object that contains the `name`, `path` and `isFolder`.
 * @typedef {Subject} CreateFileEvent
 */
const CreateFileEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about node deletion.
 * The event should contain the deleted node Object from the tree.
 * @typedef {Subject} DeleteFileEvent
 */
const DeleteFileEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about files global uploading.
 * @typedef {Subject} GlobalUploadFilesEvent
 */
const GlobalUploadFilesEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file tab selection.
 * The event should contain the path (id) of the selected file.
 * @typedef {Subject} SelectFileTabEvent
 */
const SelectFileTabEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file node selection.
 * The event should contain the selected node Object from the tree.
 * @typedef {Subject} SelectFileNodeEvent
 */
const SelectFileNodeEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file node creation.
 * The event should should be an Object that contains the `parentNodePath`, `node` and `isFolder`.
 * @typedef {Subject} CreateFileNodeEvent
 */
const CreateFileNodeEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about editor content update.
 * The event should contain the path and the status of the file to add.
 * @typedef {Subject} UpdateEditorContentEvent
 */
const UpdateEditorContentEvent = new Subject();

export default {
  CreateFileEvent,
  DeleteFileEvent,
  GlobalUploadFilesEvent,
  SelectFileTabEvent,
  SelectFileNodeEvent,
  CreateFileNodeEvent,
  UpdateEditorContentEvent,
};
