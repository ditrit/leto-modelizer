import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about file creation.
 * The event should be an Object that contains the `name`, `path` and `isFolder`.
 * @typedef {Subject} CreateFileEvent
 */
const CreateFileEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about node deletion.
 * The event should be an Object that contains `deletedNode` for the node Object to delete
 * and `parentNode` for the deleted node's parent Object.
 * @typedef {Subject} DeleteFileEvent
 */
const DeleteFileEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file global saving.
 * @typedef {Subject} GlobalSaveFilesEvent
 */
const GlobalSaveFilesEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file selection.
 * The event should be an Object that contains the `id` (path) of the file and `isSelected`.
 * @typedef {Subject} SelectFileTabEvent
 */
const SelectFileTabEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file node selection.
 * The event should be a node from the tree.
 * @typedef {Subject} SelectFileNodeEvent
 */
const SelectFileNodeEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file node creation.
 * The event should contain the id of the created file node.
 * @typedef {Subject} CreateFileNodeEvent
 */
const CreateFileNodeEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file node creation. // TODO
 * The event should contain the id of the created file node.
 * @typedef {Subject} UpdateEditorContentEvent
 */
const UpdateEditorContentEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file node creation. // TODO
 * The event should contain the id of the created file node.
 * @typedef {Subject} UpdateFileContentEvent
 */
const UpdateFileContentEvent = new Subject();

export default {
  CreateFileEvent,
  DeleteFileEvent,
  GlobalSaveFilesEvent,
  SelectFileTabEvent,
  SelectFileNodeEvent,
  CreateFileNodeEvent,
  UpdateEditorContentEvent,
  UpdateFileContentEvent,
};
