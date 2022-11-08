import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about file opening.
 * The event should be an Object that contains the `id` (path), the `label`, the `content`
 * and the `information` of the file.
 * @typedef {Subject} OpenFileEvent
 */
const OpenFileEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file selecting.
 * The event should be an Object that contains the `id` (path) of the file and `isSelected`.
 * Example: { isSelected: true, id: 'terraform/app.tf' }
 * @typedef {Subject} SelectFileEvent
 */
const SelectFileEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about node selection.
 * The event should be an Object that contains the `id` (path), `label`, `icon` and `isFolder`.
 * The Object should also contain `isNewLocalFile` for a file, or `children` for a folder.
 * @typedef {Subject} SelectFileEvent
 */
const SelectNodeEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file creation.
 * The event should be an Object that contains the `name` (path) of the file and `isFolder`.
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
 * Represent a rxjs Event object to emit and to receive events about node expansion.
 * @typedef {Subject} SelectFileEvent
 */
const ExpandFolderEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file updating.
 * The event should contain the id (path) of the file to update.
 * @typedef {Subject} UpdateFileEvent
 */
const UpdateFileEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about file global saving.
 * @typedef {Subject} GlobalSaveFilesEvent
 */
const GlobalSaveFilesEvent = new Subject();

export default {
  OpenFileEvent,
  SelectFileEvent,
  SelectNodeEvent,
  CreateFileEvent,
  DeleteFileEvent,
  ExpandFolderEvent,
  UpdateFileEvent,
  GlobalSaveFilesEvent,
};
