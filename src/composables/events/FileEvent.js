import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about file creation.
 * The event should be an Object that contains the `name`, `path` and `isFolder`.
 * @typedef {Subject} SelectFileEvent
 */
const CreateFileEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about node deletion.
 * The event should be an Object that contains `deletedNode` for the node Object to delete
 * and `parentNode` for the deleted node's parent Object.
 * @typedef {Subject} SelectFileEvent
 */
const DeleteFileEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file global saving.
 * @typedef {Subject} GlobalSaveFilesEvent
 */
const GlobalSaveFilesEvent = new Subject();

export default {
  CreateFileEvent,
  DeleteFileEvent,
  GlobalSaveFilesEvent,
};
